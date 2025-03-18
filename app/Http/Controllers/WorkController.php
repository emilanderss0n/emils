<?php

namespace App\Http\Controllers;

use App\Models\Work;

class WorkController extends Controller
{
    public function index()
    {
        return view('work.index');
    }

    public function show(Work $work)
    {
        return view('work.show', compact('work'));
    }
}
