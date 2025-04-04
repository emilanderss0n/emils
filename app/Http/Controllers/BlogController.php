<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

    public function subscribe(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        $validator = Validator::make($data ?? [], [
            'email' => 'required|email|unique:subscribers,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 422);
        }

        Subscriber::create([
            'email' => $data['email'],
            'is_active' => true,
            'subscribed_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for subscribing!'
        ]);
    }
}
