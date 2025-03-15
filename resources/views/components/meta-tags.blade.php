@props([
    'title' => "Emil's Graphics",
    'description' => null,
    'image' => null,
    'blog' => null,
])

@php
    if ($blog) {
        $title = $blog->title . ' - Emil\'s Graphics';
        $description = $blog->excerpt;
        $image = $blog->thumbnail ? asset('storage/' . $blog->thumbnail) : null;
        $url = url()->current();
        $publishedTime = $blog->created_at->toIso8601String();
        $modifiedTime = $blog->updated_at->toIso8601String();
    }
@endphp

<title>{{ $title }}</title>
<meta name="description" content="{{ $description }}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{{ url()->current() }}">

{{-- Open Graph --}}
<meta property="og:site_name" content="Emil's Graphics">
<meta property="og:title" content="{{ $title }}">
<meta property="og:description" content="{{ $description }}">
<meta property="og:image" content="{{ $image }}">
<meta property="og:url" content="{{ url()->current() }}">
@if($blog)
    <meta property="og:type" content="article">
    <meta property="article:published_time" content="{{ $publishedTime }}">
    <meta property="article:modified_time" content="{{ $modifiedTime }}">
    @if($blog->tags)
        @foreach($blog->tags as $tag)
            <meta property="article:tag" content="{{ $tag }}">
        @endforeach
    @endif
@else
    <meta property="og:type" content="website">
@endif

{{-- Twitter --}}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ $title }}">
<meta name="twitter:description" content="{{ $description }}">
<meta name="twitter:image" content="{{ $image }}">
