<?php

namespace App\Filament\Pages;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Hash;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Notifications\Actions\Action;
use Illuminate\Support\Facades\Storage;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;

class UserSettings extends Page implements HasForms
{
    use InteractsWithForms;
    
    protected static bool $shouldRegisterNavigation = false;
    
    // Add these properties
    public $name;
    public $email;
    public $avatar;
    public $alternate_email;
    public $current_password;
    public $new_password;
    public $new_password_confirmation;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $navigationLabel = 'Settings';
    protected static ?string $title = 'User Settings';
    protected static string $view = 'filament.pages.user-settings';
    
    public ?array $data = [];

    public function mount(): void
    {
        $user = auth()->user();
        
        $this->form->fill([
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'alternate_email' => $user->alternate_email,
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Grid::make(2)
                    ->schema([
                        Grid::make()
                            ->columnSpan(1)
                            ->schema([
                                Section::make('Profile Information')
                                    ->extraAttributes(['class' => 'user-settings-info'])
                                    ->schema([
                                        TextInput::make('name')
                                            ->required(),
                                        TextInput::make('email')
                                            ->email()
                                            ->required(),
                                        TextInput::make('alternate_email')
                                            ->email()
                                            ->label('Additional Email'),
                                    ]),
                            ]),
                            
                        Grid::make()
                            ->columnSpan(1)
                            ->schema([
                                Section::make('Profile Picture')
                                    ->extraAttributes(['class' => 'user-settings-avatar'])
                                    ->schema([
                                        FileUpload::make('avatar')
                                            ->image()
                                            ->disk('public')
                                            ->directory('avatars')
                                            ->visibility('public')
                                            ->imagePreviewHeight('250')
                                            ->circleCropper()
                                            ->deleteUploadedFileUsing(function ($file) {
                                                Storage::disk('public')->delete($file);
                                            }),
                                    ]),
                            ]),
                    ]),

                Section::make('Update Password')
                    ->extraAttributes(['class' => 'password-section'])
                    ->schema([
                        TextInput::make('current_password')
                            ->password()
                            ->label('Current Password'),
                        Grid::make(2)
                            ->schema([
                                TextInput::make('new_password')
                                    ->password()
                                    ->label('New Password')
                                    ->confirmed(),
                                TextInput::make('new_password_confirmation')
                                    ->password()
                                    ->label('Confirm New Password'),
                            ]),
                    ])
                    ->collapsible(),
            ])
            ->statePath('data');
    }

    public function submit(): void
    {
        $data = $this->form->getState();
        $user = auth()->user();

        // Handle avatar update/deletion
        if ($user->avatar && (!isset($data['avatar']) || $data['avatar'] === '')) {
            Storage::disk('public')->delete($user->avatar);
            $user->avatar = null;
        } elseif (isset($data['avatar'])) {
            $user->avatar = $data['avatar'];
        }
        
        $user->name = $data['name'];
        $user->email = $data['email'];
        
        if ($data['alternate_email']) {
            $user->alternate_email = $data['alternate_email'];
        }

        if ($data['current_password'] && $data['new_password']) {
            if (!Hash::check($data['current_password'], $user->password)) {
                $this->addError('current_password', 'The current password is incorrect.');
                return;
            }
            $user->password = Hash::make($data['new_password']);
        }

        $user->save();

        Notification::make()
            ->title('Settings updated successfully')
            ->success()
            ->send();
    }
}
