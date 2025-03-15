<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\Category;
use Illuminate\Http\Request;

class WorkController extends Controller
{
    public function index(Request $request)
    {
        $query = Work::with('categories');

        if ($request->category) {
            $query->whereHas('categories', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        $works = $query->orderBy('project_date', 'desc')
                      ->orderBy('created_at', 'desc')
                      ->paginate(12)
                      ->withQueryString();
        $categories = Category::all();
        
        return view('work.index', compact('works', 'categories'));
    }

    public function show(Work $work)
    {
        return view('work.show', compact('work'));
    }
}
