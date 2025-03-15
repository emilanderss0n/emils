<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\App;
use Prism\Prism\Prism;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Text\Response as TextResponse;
use Prism\Prism\ValueObjects\Usage;
use Prism\Prism\Enums\FinishReason;

class DebugPrism extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-bug-ant';
    protected static ?string $navigationLabel = 'Debug AI';
    protected static ?string $title = 'AI Integration Debugger';
    protected static ?int $navigationSort = 99;
    protected static string $view = 'filament.pages.debug-prism';
    protected static ?string $navigationGroup = 'Development';
    
    // Only show in development environment
    public static function shouldRegisterNavigation(): bool
    {
        return App::environment('local');
    }
    
    protected function getHeaderActions(): array
    {
        return [
            Action::make('testConnectionMock')
                ->label('Test with Mock')
                ->color('success')
                ->icon('heroicon-o-beaker')
                ->action(function (): void {
                    try {
                        Log::info('Using mock response - no API call');
                        
                        Notification::make()
                            ->title('Mock Response')
                            ->body('Hello! This is a mock response (no API credits used).')
                            ->success()
                            ->send();
                    } catch (\Exception $e) {
                        Log::error('Mock test failed', [
                            'message' => $e->getMessage()
                        ]);
                    }
                }),
        
            Action::make('testConnection')
                ->label('Test API Connection')
                ->color('warning')
                ->icon('heroicon-o-server')
                ->action(function (): void {
                    try {
                        // Add a small delay to avoid hammering the API
                        sleep(1);
                        
                        $apiKey = env('OPENAI_API_KEY');
                        $safeApiKey = substr($apiKey, 0, 10) . '...';
                        Log::info('Testing OpenAI connection', ['api_key_prefix' => $safeApiKey]);
                        
                        $response = Prism::text()
                            ->using(Provider::OpenAI, 'gpt-4o-mini')
                            ->withSystemPrompt("Please respond with only these words: I'm the AI provider and the connection was successful.")
                            ->withPrompt("Did you get my prompt?")
                            ->generate();
                            
                        $content = $response->text;
                        
                        Log::info('OpenAI test response', ['content' => $content]);
                        
                        Notification::make()
                            ->title('Connection Successful')
                            ->body($content)
                            ->success()
                            ->send();
                    } catch (\Exception $e) {
                        $errorMessage = $e->getMessage();
                        Log::error('OpenAI connection test failed', [
                            'message' => $errorMessage,
                            'code' => $e->getCode(),
                        ]);
                        
                        // More helpful error messages
                        $detailedMsg = "Error: " . $errorMessage;
                        
                        if (strpos($errorMessage, 'rate limit') !== false) {
                            $detailedMsg = "Rate limit error detected. Your OpenAI API key is hitting usage limits.\n\n";
                            $detailedMsg .= "Solutions:\n";
                            $detailedMsg .= "1. Wait 20 seconds and try again\n";
                            $detailedMsg .= "2. Use a different API key\n";
                            $detailedMsg .= "3. Create a paid account to increase your rate limits\n";
                            $detailedMsg .= "4. Try the 'Test with Mock' button instead";
                        }
                        
                        Notification::make()
                            ->title('OpenAI Connection Failed')
                            ->body($detailedMsg)
                            ->danger()
                            ->persistent()
                            ->send();
                    }
                }),
            
            Action::make('checkApiKey')
                ->label('Validate API Key')
                ->color('info')
                ->icon('heroicon-o-key')
                ->action(function (): void {
                    $apiKey = env('OPENAI_API_KEY');
                    
                    if (empty($apiKey)) {
                        Notification::make()
                            ->title('API Key Missing')
                            ->body('No API key found in your .env file.')
                            ->danger()
                            ->send();
                        return;
                    }
                    
                    // Updated validation pattern to include all sk- formats
                    // This covers both regular keys (sk-abc123) and project-scoped keys (sk-proj-abc123)
                    $keyPattern = '/^sk-[a-zA-Z0-9-_]{16,}$/';
                    if (!preg_match($keyPattern, $apiKey)) {
                        Notification::make()
                            ->title('Invalid API Key Format')
                            ->body('The API key does not appear to be a valid OpenAI key. All OpenAI keys should start with "sk-".')
                            ->warning()
                            ->send();
                    } else {
                        Notification::make()
                            ->title('API Key Format Valid')
                            ->body('Your API key appears to be in the correct format.')
                            ->success()
                            ->send();
                    }
                }),
        ];
    }
}
