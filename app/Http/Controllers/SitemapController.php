<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\Blog;
use Carbon\Carbon;

class SitemapController extends Controller
{
    public function index($format = 'xml')
    {
        $works = Work::all();
        $blogs = Blog::all();
        
        if ($format === 'html') {
            return view('sitemap.html', compact('works', 'blogs'));
        }
        
        $content = view('sitemap.xml', compact('works', 'blogs'));
        return response($content)->header('Content-Type', 'application/xml');
    }
}
