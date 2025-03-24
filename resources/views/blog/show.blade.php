@extends('layouts.default')

@section('main-content')
<div class="content-container">
    <article class="blog-post">
        @if($blog->thumbnail)
        <div class="blog-thumbnail">
            <img src="{{ asset('storage/' . $blog->thumbnail) }}" alt="{{ $blog->title }}">
        </div>
        @endif
        <div class="sidebar">
            <div class="sidebar-inner">
                @if($blog->thumbnail)
                <div class="post-thumb">
                    <img src="{{ asset('storage/' . $blog->thumbnail) }}" alt="{{ $blog->title }}">
                </div>
                @endif
                <div class="blog-author widget">
                    <div class="widget-inner">
                        <p><i class="bi bi-pen"></i> {{ $blog->author }}</p>
                        <p><i class="bi bi-clock"></i> {{ $blog->created_at->format('M d, Y') }}</p>
                    </div>
                </div>
                <div class="blog-toc">
                    <h3>Table of Contents</h3>
                    <div class="toc-container">
                        <!-- Table of contents will be generated by JavaScript -->
                        <div id="table-of-contents"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-container">
            <div class="blog-post-header">
                <div class="blog-fancy-heading">
                    <h1>{{ $blog->title }}</h1>
                </div>
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
</div>
@endsection
