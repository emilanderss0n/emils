<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterTemplateResource\Pages;
use App\Models\NewsletterTemplate;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Illuminate\Support\HtmlString;
use App\Models\Subscriber;
use Illuminate\Support\Facades\Mail;
use App\Mail\Newsletter;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;

class NewsletterTemplateResource extends Resource
{
    protected static ?string $model = NewsletterTemplate::class;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';
    
    protected static ?string $navigationGroup = 'Marketing';

    protected static ?string $modelLabel = 'Newsletter';
    protected static ?string $pluralModelLabel = 'Newsletters';
    protected static ?string $navigationLabel = 'Newsletters';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Newsletter name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('subject')
                    ->required()
                    ->maxLength(255),
                TinyEditor::make('content')
                    ->required()
                    ->columnSpanFull()
                    ->profile('custom')
                    ->columnSpan('full'),
                Forms\Components\Toggle::make('is_active')
                    ->required(),
            ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('subject')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('last_sent_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active'),
            ])
            ->actions([
                Action::make('send')
                    ->label('Send Newsletter')
                    ->icon('heroicon-o-paper-airplane')
                    ->requiresConfirmation()
                    ->form([
                        Forms\Components\Select::make('test_email')
                            ->label('Send test to email (optional)')
                            ->options(fn () => Subscriber::pluck('email', 'email'))
                            ->searchable(),
                        Forms\Components\Toggle::make('send_to_all')
                            ->label('Send to all active subscribers')
                            ->default(false),
                    ])
                    ->action(function (NewsletterTemplate $record, array $data): void {
                        if (!empty($data['test_email'])) {
                            $subscriber = Subscriber::where('email', $data['test_email'])->first();
                            Mail::to($data['test_email'])->send(new Newsletter($record, $subscriber));
                            $record->touch('last_sent_at');
                            return;
                        }

                        if ($data['send_to_all']) {
                            $subscribers = Subscriber::where('is_active', true)->get();
                            foreach ($subscribers as $subscriber) {
                                Mail::to($subscriber->email)->send(new Newsletter($record, $subscriber));
                            }
                            $record->touch('last_sent_at');
                        }
                    }),
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNewsletterTemplates::route('/'),
            'create' => Pages\CreateNewsletterTemplate::route('/create'),
            'edit' => Pages\EditNewsletterTemplate::route('/{record}/edit'),
        ];
    }
}