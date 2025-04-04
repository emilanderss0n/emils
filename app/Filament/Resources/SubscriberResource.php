<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubscriberResource\Pages;
use App\Models\Subscriber;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;
use Filament\Tables\Actions\BulkAction;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Illuminate\Database\Eloquent\Collection;
use Filament\Notifications\Notification;

class SubscriberResource extends Resource
{
    protected static ?string $model = Subscriber::class;
    protected static ?string $navigationIcon = 'heroicon-o-envelope';
    protected static ?string $navigationGroup = 'Marketing';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('name')
                    ->maxLength(255),
                Forms\Components\Toggle::make('is_active')
                    ->label('Active')
                    ->default(true),
                Forms\Components\DateTimePicker::make('subscribed_at')
                    ->default(now())
                    ->disabled()
                    ->dehydrated(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\TextColumn::make('subscribed_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('is_active')
                    ->options([
                        '1' => 'Active',
                        '0' => 'Inactive',
                    ])
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    BulkAction::make('send_email')
                        ->label('Send Email')
                        ->icon('heroicon-o-envelope')
                        ->form([
                            Forms\Components\TextInput::make('subject')
                                ->required()
                                ->maxLength(255),
                            TinyEditor::make('content')
                                ->required()
                                ->columnSpanFull()
                                ->fileAttachmentsDisk('public')
                                ->fileAttachmentsDirectory('email-attachments')
                        ])
                        ->action(function (Collection $records, array $data) {
                            $failedCount = 0;
                            
                            foreach ($records as $subscriber) {
                                if ($subscriber->is_active) {
                                    try {
                                        Mail::html($data['content'], function ($message) use ($subscriber, $data) {
                                            $message->to($subscriber->email)
                                                ->subject($data['subject']);
                                        });
                                    } catch (\Exception $e) {
                                        $failedCount++;
                                    }
                                }
                            }

                            if ($failedCount > 0) {
                                Notification::make()
                                    ->warning()
                                    ->title('Some emails failed to send')
                                    ->body("Failed to send {$failedCount} emails.")
                                    ->send();
                            } else {
                                Notification::make()
                                    ->success()
                                    ->title('Emails sent successfully')
                                    ->body('All emails have been sent to the selected subscribers.')
                                    ->send();
                            }
                        }),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubscribers::route('/'),
            'create' => Pages\CreateSubscriber::route('/create'),
            'edit' => Pages\EditSubscriber::route('/{record}/edit'),
        ];
    }
}
