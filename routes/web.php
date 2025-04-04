<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\WorkController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/work', [WorkController::class, 'index'])->name('work');
Route::get('/work/{work}', [WorkController::class, 'show'])->name('work.show');

Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{blog}', [BlogController::class, 'show'])->name('blog.show');

Route::get('/api/search', [SearchController::class, 'ajaxSearch'])->name('search.ajax');

Route::get('/about', function () {
    return view('about');
})->name('about');

Route::get('/contact', function () {
    return view('contact');
})->name('contact');

Route::get('/privacy', function () {
    return view('pages.gdpr');
})->name('privacy');

Route::post('/contact/submit', [ContactController::class, 'submit'])
    ->name('contact.submit')
    ->middleware(['throttle:contact-form']);

Route::post('/blog/subscribe', [BlogController::class, 'subscribe'])
    ->name('blog.subscribe')
    ->middleware(['web']);

Route::get('sitemap.xml', [SitemapController::class, 'index'])->name('sitemap.xml');
Route::get('sitemap', [SitemapController::class, 'index'])->defaults('format', 'html')->name('sitemap');

Route::get('/unsubscribe/{email}', function($email) {
    try {
        $email = base64_decode($email);
        $subscriber = \App\Models\Subscriber::where('email', $email)->first();
        
        if ($subscriber) {
            $subscriber->update(['is_active' => false]);
            return redirect()->route('blog.index')->with('success', 'You have been unsubscribed successfully.');
        }
        
        return redirect()->route('blog.index')->with('error', 'Unable to unsubscribe. Please contact support.');
    } catch(\Exception $e) {
        return redirect()->route('blog.index')->with('error', 'Invalid unsubscribe link.');
    }
})->name('unsubscribe');