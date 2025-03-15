<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index()
    {
        $posts = Blog::latest()->paginate(12);
        return view('blog.index', compact('posts'));
    }

    public function show(Blog $blog)
    {
        return view('blog.show', compact('blog'));
    }
}
