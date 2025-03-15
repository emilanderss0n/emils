<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        // ...existing code...
        \App\Http\Middleware\Cors::class,
        // ...existing code...
    ];

    protected $middlewareGroups = [
        'web' => [
            // ...existing middleware...
            \App\Http\Middleware\ForceAnalyticsDateRange::class,
        ],
        // ...existing code...
    ];
    // ...existing code...
}
