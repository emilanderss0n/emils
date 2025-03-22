@extends('layouts.default')

@section('main-content')
<section class="blog-section">
    <div class="content-container">
        <div class="blog-header">
            <h1><i class="bi bi-journal-text"></i> Blog</h1>
            <p class="blog-presentation">Exploring the intersection of design & technology through web, games, motion, and 3D.</p>
        </div>
        
        <div class="blog-grid">
            @foreach($posts as $post)
                <div class="blog-item">
                    <a href="{{ route('blog.show', $post) }}">
                        @if($post->thumbnail)
                            <div class="blog-thumbnail">
                                <img src="{{ asset('storage/' . $post->thumbnail) }}" loading="lazy" alt="{{ $post->title }}">
                            </div>
                        @endif
                        <div class="blog-content">
                            <div class="blog-meta">
                                <span class="blog-date">{{ $post->created_at->format('M d, Y') }}</span>
                            </div>
                            <h2>{{ $post->title }}</h2>
                            <p>{!! Str::limit($post->excerpt, 120) !!}</p>
                        </div>
                    </a>
                </div>
            @endforeach
        </div>
        
        {{ $posts->links() }}
    </div>
</section>
@endsection
