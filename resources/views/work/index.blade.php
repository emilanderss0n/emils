@extends('layouts.default')

@section('main-content')
<section class="work-main">
    <div class="content-container">
        <div class="portfolio-top">
            <h2 class="dec-title"><span><i class="bi bi-suitcase-lg"></i></span> Portfolio</h2>
            <div class="category-filter">
                <a href="{{ route('work') }}" class="btn-Fx filter-item {{ !request('category') ? 'active' : '' }}"><span>All Work</span></a>
                @foreach($categories as $category)
                    <a href="{{ route('work', ['category' => $category->slug]) }}" 
                       class="btn-Fx filter-item {{ request('category') == $category->slug ? 'active' : '' }}">
                        <span>{{ $category->name }}</span>
                    </a>
                @endforeach
            </div>
        </div>
        <div class="portfolio-grid">
            @foreach($works as $work)
                <div class="portfolio-grid-item">
                    <a href="{{ route('work.show', $work) }}" class="portfolio-item-link">
                        <div class="portfolio-item-thumbnail">
                            @if($work->thumbnail)
                                <img src="{{ asset('storage/' . $work->thumbnail) }}" alt="{{ $work->name }}">
                            @endif
                            <div class="portfolio-item-hover">
                                <span class="portfolio-item-title">{{ $work->name }}</span>
                                @if($work->categories->count())
                                    <span class="portfolio-item-category">{{ $work->categories->pluck('name')->join(', ') }}</span>
                                @endif
                            </div>
                        </div>
                    </a>
                </div>
            @endforeach
        </div>
        {{ $works->links() }}
    </div>
</section>
@endsection
