<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\WorkController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SitemapController;
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

Route::get('sitemap.xml', [SitemapController::class, 'index'])->name('sitemap.xml');
Route::get('sitemap', [SitemapController::class, 'index'])->defaults('format', 'html')->name('sitemap');