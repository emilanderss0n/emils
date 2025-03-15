<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\ServiceProvider;
use BezhanSalleh\FilamentGoogleAnalytics\Widgets\OverviewWidget;
use Livewire\Livewire;
use Livewire\Component;

class GoogleAnalyticsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Forces all analytics filters to use LTD
        config(['filament-google-analytics.default_date_range' => 'LTD']);
    }

    public function boot(): void
    {
        // Direct modification of core Livewire behavior for analytics widgets
        if (class_exists(\Livewire\Livewire::class)) {
            // Hook into the initial Livewire component hydration
            Livewire::listen('component.hydrate.initial', function (Component $component, $request) {
                if (str_contains(get_class($component), 'BezhanSalleh\\FilamentGoogleAnalytics\\Widgets\\')) {
                    // Force the filter to LTD when component is first hydrated
                    $component->filter = 'LTD';
                }
            });
            
            // Hook into component dehydration (when data is sent to client)
            Livewire::listen('component.dehydrate', function (Component $component, $response) {
                if (str_contains(get_class($component), 'BezhanSalleh\\FilamentGoogleAnalytics\\Widgets\\')) {
                    // Override data just before it's sent to browser
                    $startDate = Carbon::now()->subDays(30)->startOfDay();
                    $endDate = Carbon::now()->endOfDay();
                    
                    // Force date range before data is processed for display
                    $component->filter = 'LTD';
                    
                    // Use reflection to directly modify the private properties
                    $reflectionClass = new \ReflectionClass($component);
                    if ($reflectionClass->hasMethod('getData')) {
                        // Call getData method to refresh the data with our dates
                        $component->getData($startDate, $endDate);
                    }
                }
            });
            
            // Add component hook for when a property updates
            Livewire::listen('property.update', function (Component $component, $name, $value) {
                // If someone tries to change the filter value, force it back to LTD
                if ($name === 'filter' && 
                    str_contains(get_class($component), 'BezhanSalleh\\FilamentGoogleAnalytics\\Widgets\\')) {
                    $component->filter = 'LTD';
                }
            });
        }
        
        // Register a wrapper for Analytics to force our date range
        $this->app->extend('analytics', function ($analytics, $app) {
            // Wrap the analytics service with our own proxy
            return new class($analytics) {
                protected $analytics;
                
                public function __construct($analytics) {
                    $this->analytics = $analytics;
                }
                
                // Override the fetch methods to always use 30-day period
                public function fetchTotalVisitorsAndPageViews($period = null) {
                    $period = \Spatie\Analytics\Period::create(
                        Carbon::now()->subDays(30)->startOfDay(),
                        Carbon::now()->endOfDay()
                    );
                    return $this->analytics->fetchTotalVisitorsAndPageViews($period);
                }
                
                public function fetchVisitorsAndPageViews($period = null) {
                    $period = \Spatie\Analytics\Period::create(
                        Carbon::now()->subDays(30)->startOfDay(),
                        Carbon::now()->endOfDay()
                    );
                    return $this->analytics->fetchVisitorsAndPageViews($period);
                }
                
                // Forward all other calls to the original instance
                public function __call($method, $parameters) {
                    // If the method is a fetch method that takes a period, 
                    // replace the period with our 30-day period
                    if (strpos($method, 'fetch') === 0 && isset($parameters[0])) {
                        $parameters[0] = \Spatie\Analytics\Period::create(
                            Carbon::now()->subDays(30)->startOfDay(),
                            Carbon::now()->endOfDay()
                        );
                    }
                    return call_user_func_array([$this->analytics, $method], $parameters);
                }
            };
        });
    }
}
