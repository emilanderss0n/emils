@extends('layouts.default')

@section('main-content')
<div class="content-container">

    <div class="generic-page">

        <section class="search-results">
            <h1>Search Results for: "{{ $query }}"</h1>
            
            @if($works->isEmpty() && $posts->isEmpty())
                <p>No results found for your search.</p>
            @else
                @if($works->isNotEmpty())
                    <div class="search-section">
                        <h2>Works ({{ $works->count() }})</h2>
                        <div class="work-grid">
                            @foreach($works as $work)
                                <article class="work-card">
                                    @if($work->thumbnail)
                                        <img src="{{ asset('storage/' . $work->thumbnail) }}" alt="{{ $work->name }}">
                                    @endif
                                    <h3>{{ $work->name }}</h3>
                                    <a href="{{ route('work.show', $work) }}" class="btn">View Project</a>
                                </article>
                            @endforeach
                        </div>
                    </div>
                @endif

                @if($posts->isNotEmpty())
                    <div class="search-section">
                        <h2>Blog Posts ({{ $posts->count() }})</h2>
                        <div class="blog-grid">
                            @foreach($posts as $post)
                                <article class="blog-card">
                                    @if($post->thumbnail)
                                        <img src="{{ asset('storage/' . $post->thumbnail) }}" alt="{{ $post->title }}">
                                    @endif
                                    <h3>{{ $post->title }}</h3>
                                    <p>{{ Str::limit(strip_tags($post->content), 100) }}</p>
                                </article>
                            @endforeach
                        </div>
                    </div>
                @endif
            @endif
        </section>
        
    </div>

</div>
@endsection
