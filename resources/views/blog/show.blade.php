@extends('layouts.default')

@section('main-content')
<article class="blog-post">
    <div class="content-container">
        <div class="blog-post-header">
            <div class="blog-fancy-heading">
                <h1>{{ $blog->title }}</h1>
                <div class="blog-meta">
                    <span class="blog-date">Author: {{ $blog->author }},</span>
                    <span class="blog-date">{{ $blog->created_at->format('M d, Y') }}</span>
                </div>
            </div>
            @if($blog->thumbnail)
                <div class="blog-thumbnail">
                    <img src="{{ asset('storage/' . $blog->thumbnail) }}" alt="{{ $blog->title }}">
                </div>
            @endif
        </div>
        
        <div class="blog-content">
            {!! $blog->content !!}
        </div>

        <div class="blog-footer">
            <div class="blog-tags">
                @if($blog->tags && count($blog->tags) > 0)
                    <div class="tags">
                        @foreach($blog->tags as $tag)
                            <span class="tag">{{ $tag }}</span>
                        @endforeach
                    </div>
                @endif
            </div>
            <div class="blog-share">
                <div class="social-links">
                    <span>Share:</span>
                    <a href="https://www.facebook.com/sharer/sharer.php?u={{ url()->current() }}" target="_blank" class="social btn-facebook"><i class="bi bi-facebook"></i></a>
                    <a href="https://twitter.com/intent/tweet?url={{ url()->current() }}" target="_blank" class="social btn-twitter"><i class="bi bi-twitter-x"></i></a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url={{ url()->current() }}" target="_blank" class="social btn-linkedin"><i class="bi bi-linkedin"></i></a>
                </div>
            </div>
        </div>
    
    </div>
</article>
@endsection
