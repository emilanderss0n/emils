<?php

namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Spatie\Analytics\Period;
use Symfony\Component\HttpFoundation\Response;

class ForceAnalyticsDateRange
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only intercept admin routes
        if (strpos($request->path(), 'admin') === 0) {
            // Check if analytics service is bound
            if (app()->bound('analytics')) {
                $originalAnalytics = app('analytics');
                
                // Unbind original analytics instance
                app()->forgetInstance('analytics');
                
                // Rebind with our proxy that forces 30-day period
                app()->instance('analytics', new class($originalAnalytics) {
                    protected $analytics;
                    
                    public function __construct($analytics) {
                        $this->analytics = $analytics;
                    }
                    
                    // Force 30 day period for specific methods
                    public function fetchVisitorsAndPageViews($period = null) {
                        $period = Period::create(
                            Carbon::now()->subDays(30)->startOfDay(),
                            Carbon::now()->endOfDay()
                        );
                        return $this->analytics->fetchVisitorsAndPageViews($period);
                    }
                    
                    public function fetchTotalVisitorsAndPageViews($period = null) {
                        $period = Period::create(
                            Carbon::now()->subDays(30)->startOfDay(),
                            Carbon::now()->endOfDay()
                        );
                        return $this->analytics->fetchTotalVisitorsAndPageViews($period);
                    }
                    
                    // Generic method interceptor
                    public function __call($method, $args) {
                        // If method takes Period, replace it
                        if (isset($args[0]) && $args[0] instanceof Period) {
                            $args[0] = Period::create(
                                Carbon::now()->subDays(30)->startOfDay(),
                                Carbon::now()->endOfDay()
                            );
                        }
                        return call_user_func_array([$this->analytics, $method], $args);
                    }
                });
            }
        }
        
        return $next($request);
    }
}
