@extends('layouts.default')

@section('main-content')
<section class="content-container">

    <div class="generic-page">

        <h1>Sitemap for emils.graphics</h1>
        
        <div class="sitemap-section">
            <h2>Main Pages</h2>
            <div class="sitemap-main-nav">
                @include('partials.main-nav')
            </div>
            <h2>Misc Pages</h2>
            <div class="sitemap-main-nav">
                @include('partials.misc-nav')
            </div>
        </div>

        <div class="sitemap-section">
            <h2>Work Items</h2>
            <ul>
                @foreach($works as $work)
                    <li><a href="{{ route('work.show', $work) }}">{{ $work->name }}</a></li>
                @endforeach
            </ul>
        </div>

    </div>

</section>
@endsection
