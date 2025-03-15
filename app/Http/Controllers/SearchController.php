<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\Blog;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q');
        
        $works = Work::when($query, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        })->latest()->get();

        $posts = Blog::when($query, function ($query, $search) {
            return $query->where('title', 'like', "%{$search}%")
                ->orWhere('content', 'like', "%{$search}%")
                ->orWhere('tags', 'like', "%{$search}%");
        })->latest()->get();

        return view('search', compact('works', 'posts', 'query'));
    }
}
