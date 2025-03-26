<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\Post;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $latestWorks = Work::with('categories')
        ->where('featured', true)
        ->latest('project_date')
        ->take(4)
        ->get();

        $latestWorksGrid = Work::with('categories')
        ->latest('project_date')
        ->take(12)
        ->get();

        return view('home', [
            'latestWorks' => $latestWorks,
            'latestWorksGrid' => $latestWorksGrid,
            'latestPosts' => Post::latest()->take(3)->get(),
        ]);
    }
}
