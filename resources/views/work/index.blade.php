@extends('layouts.default')

@section('main-content')
<section class="work-main">
    <div class="content-container">
        <div class="portfolio-top">
            <h2 class="dec-title"><span><i class="bi bi-suitcase-lg"></i></span> Portfolio</h2>
            <div class="category-filter">
                <a href="{{ route('work') }}" class="btn-Fx filter-item {{ !request('category') ? 'active' : '' }}"><i class="bi bi-eye"></i><span>All</span></a>
                @foreach($categories as $category)
                    <a href="{{ route('work', ['category' => $category->slug]) }}" 
                       class="btn-Fx filter-item {{ request('category') == $category->slug ? 'active' : '' }}">
                       @if($category->name == 'Web Development')
                        <i class="bi bi-laptop"></i>
                        @elseif($category->name == 'Software Development')
                        <i class="bi bi-code-slash"></i>
                        @elseif($category->name == 'Graphic Design')
                        <i class="bi bi-palette"></i>
                        @elseif($category->name == '3D Visualization')
                        <i class="bi bi-box"></i>
                        @elseif($category->name == 'Other')
                        <i class="bi bi-tags-fill"></i>
                       @endif
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
