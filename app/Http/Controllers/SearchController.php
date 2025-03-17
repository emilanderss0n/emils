<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q', '');
        
        $works = Work::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->get();
            
        $posts = Blog::where('title', 'like', "%{$query}%")
            ->orWhere('content', 'like', "%{$query}%")
            ->get();
            
        return view('search', compact('works', 'posts', 'query'));
    }
    
    public function ajaxSearch(Request $request)
    {
        $query = $request->input('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([
                'works' => [],
                'posts' => [],
                'pages' => []
            ]);
        }
        
        $works = Work::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->take(5)
            ->get()
            ->map(function ($work) {
                return [
                    'id' => $work->id,
                    'slug' => $work->slug,
                    'name' => $work->name,
                    'thumbnail' => $work->thumbnail ? true : false,
                    'thumbnail_url' => $work->thumbnail ? asset('storage/' . $work->thumbnail) : null
                ];
            });
            
        $posts = Blog::where('title', 'like', "%{$query}%")
            ->orWhere('content', 'like', "%{$query}%")
            ->take(5)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'slug' => $post->slug, // Add the slug
                    'title' => $post->title,
                    'excerpt' => Str::limit(strip_tags($post->content), 80),
                    'thumbnail' => $post->thumbnail ? true : false,
                    'thumbnail_url' => $post->thumbnail ? asset('storage/' . $post->thumbnail) : null
                ];
            });
            
        // Add page suggestions
        $pages = $this->getPageSuggestions($query);
            
        return response()->json([
            'works' => $works,
            'posts' => $posts,
            'pages' => $pages
        ]);
    }
    
    private function getPageSuggestions($query)
    {
        // Define common pages and their associated keywords
        $pageKeywords = [
            'home' => ['home', 'main', 'landing', 'welcome', 'front', 'start'],
            'about' => ['about', 'about me', 'bio', 'biography', 'profile', 'emil', 'andersson'],
            'work' => ['work', 'portfolio', 'projects', 'showcase', 'gallery'],
            'blog' => ['blog', 'articles', 'posts', 'news', 'writing'],
            'contact' => ['contact', 'reach out', 'email', 'message', 'get in touch']
        ];
        
        // Icons for each page
        $pageIcons = [
            'home' => 'bi-house-door',
            'about' => 'bi-person',
            'work' => 'bi-briefcase',
            'blog' => 'bi-journal-richtext',
            'contact' => 'bi-envelope'
        ];
        
        $suggestions = [];
        $query = strtolower(trim($query));
        
        foreach ($pageKeywords as $page => $keywords) {
            // Check if query matches page name or any of its keywords
            if (str_contains($page, $query) || 
                array_filter($keywords, fn($keyword) => str_contains($keyword, $query))) {
                
                $pageRoute = 'home';
                if ($page !== 'home') {
                    $pageRoute = $page === 'blog' ? 'blog.index' : $page;
                }
                
                $suggestions[] = [
                    'name' => ucfirst($page),
                    'route' => route($pageRoute),
                    'description' => 'Visit the ' . ucfirst($page) . ' page',
                    'icon' => $pageIcons[$page]
                ];
            }
        }
        
        return $suggestions;
    }
}
