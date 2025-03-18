<?php

namespace App\Providers\Filament;

use App\Filament\Pages\UserSettings;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use BezhanSalleh\FilamentGoogleAnalytics\FilamentGoogleAnalyticsPlugin;
use Illuminate\Support\Facades\App;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        // Define pages based on environment
        $pages = [Pages\Dashboard::class];
        
        // Always include GenerateBlogPost in all environments
        $pages[] = \App\Filament\Pages\GenerateBlogPost::class;
        
        // Only include debug tools in local environment
        if (App::environment('local')) {
            $pages[] = \App\Filament\Pages\DebugPrism::class;
        }
        
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->sidebarCollapsibleOnDesktop()
            ->colors([
                'danger' => Color::Rose,
                'gray' => [
                    50 => '247, 248, 249',
                    100 => '242, 244, 245',
                    200 => '234, 236, 238',
                    300 => '224, 227, 230',
                    400 => '201, 206, 211',
                    500 => '176, 183, 190',
                    600 => '149, 158, 167',
                    700 => '120, 130, 140',
                    800 => '31, 35, 42',
                    900 => '24, 28, 35',
                    950 => '13, 18, 23',
                ],
                'info' => Color::Blue,
                'primary' => Color::Indigo,
                'success' => Color::Emerald,
                'warning' => Color::Orange,
            ])
            ->viteTheme('resources/css/filament/admin/theme.css')
            ->font('Inter')
            ->brandName('DASH.XE')
            ->favicon(asset('images/favicon/favicon-32x32.png'))
            ->spa()
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages($pages)
            ->userMenuItems([
                'settings' => \Filament\Navigation\MenuItem::make()
                    ->label('User Settings')
                    ->url(fn (): string => UserSettings::getUrl())
                    ->icon('heroicon-o-cog-6-tooth')
            ])
            ->plugins([
                FilamentGoogleAnalyticsPlugin::make()
            ])
            ->widgets([
                Widgets\AccountWidget::class,
                \App\Filament\Widgets\UpcomingBirthdays::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
