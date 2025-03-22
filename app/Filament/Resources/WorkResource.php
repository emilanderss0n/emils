<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WorkResource\Pages;
use App\Models\Work;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Illuminate\Support\Str;

class WorkResource extends Resource
{
    protected static ?string $model = Work::class;
    protected static ?string $navigationIcon = 'heroicon-o-briefcase';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('categories')
                    ->multiple()
                    ->relationship('categories', 'name')
                    ->required(),
                Forms\Components\Grid::make()
                    ->schema([
                        Forms\Components\DatePicker::make('project_date'),
                        Forms\Components\TextInput::make('live_url')
                            ->url()
                            ->maxLength(255)
                    ]),
                Forms\Components\FileUpload::make('thumbnail')
                    ->image()
                    ->optimize('webp')
                    ->required()
                    ->directory('works/thumbnails')
                    ->panelAspectRatio('2:1'),
                Forms\Components\FileUpload::make('images')
                    ->multiple()
                    ->image()
                    ->directory('works/images')
                    ->live()
                    ->imagePreviewHeight('100')
                    ->reorderable(),
                Forms\Components\Textarea::make('description')
                    ->required()
                    ->rows(4)
                    ->columnSpanFull(),
                TinyEditor::make('content')
                    ->fileAttachmentsDisk('public')
                    ->fileAttachmentsDirectory('works/content')
                    ->fileAttachmentsVisibility('public')
                    ->columnSpanFull()
                    ->hidden(fn (Forms\Get $get): bool => filled($get('images')))
                    ->profile('custom')
                    ->columnSpan('full'),
                Forms\Components\Grid::make()
                    ->schema([
                        Forms\Components\Checkbox::make('featured')
                            ->label('Featured work'),
                        Forms\Components\Checkbox::make('ongoing')
                            ->label('Project is ongoing')
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('thumbnail')
                    ->width(80)
                    ->height(60)
                    ->extraImgAttributes(['class' => 'rounded-md']),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('project_date')
                    ->date(),
                Tables\Columns\IconColumn::make('featured')
                    ->boolean(),
                Tables\Columns\IconColumn::make('ongoing')
                    ->boolean(),
                Tables\Columns\TextColumn::make('categories.name')
                    ->badge()
                    ->separator(','),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime(),
            ])
            ->defaultSort('project_date', 'desc')
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }


    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWorks::route('/'),
            'create' => Pages\CreateWork::route('/create'),
            'edit' => Pages\EditWork::route('/{record}/edit'),
        ];
    }
}
