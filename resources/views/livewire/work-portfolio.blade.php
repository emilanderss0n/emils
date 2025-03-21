<div
    x-data="{}"
    x-init="$wire.on('portfolioUpdated', () => setTimeout(() => window.reinitializePortfolioAnimation(), 100))"
>
    <div class="portfolio-top">
        <h2 class="dec-title"><span><i class="bi bi-suitcase-lg"></i></span> Portfolio</h2>
        <div class="category-filter">
            <button wire:click="filterByCategory()" 
                    class="btn-Fx filter-item {{ !$selectedCategory ? 'active' : '' }}">
                <i class="bi bi-eye"></i><span>All</span>
            </button>
            @foreach($categories as $category)
                <button wire:click="filterByCategory('{{ $category->slug }}')" 
                       class="btn-Fx filter-item {{ $selectedCategory == $category->slug ? 'active' : '' }}">
                   @if($category->name == 'Web Development')
                    <i class="bi bi-laptop"></i>
                    @elseif($category->name == 'Software Development')
                    <i class="bi bi-code-slash"></i>
                    @elseif($category->name == 'Graphic Design')
                    <i class="bi bi-palette"></i>
                    @elseif($category->name == '3D Visualization')
                    <i class="bi bi-box"></i>
                    @else
                    <i class="bi bi-tags-fill"></i>
                   @endif
                    <span>{{ $category->name }}</span>
                </button>
            @endforeach
        </div>
    </div>

    <div id="portfolio-grid" class="portfolio-grid" wire:loading.class="content-loading">
        @foreach($works as $work)
            <div class="portfolio-grid-item">
                <a href="{{ route('work.show', $work) }}" class="portfolio-item-link">
                    <div class="portfolio-item-thumbnail">
                        @if($work->thumbnail)
                            <img src="{{ asset('storage/' . $work->thumbnail) }}" alt="{{ $work->name }}">
                        @endif
                        <div class="portfolio-item-hover">
                            <span class="portfolio-item-title"><h2>{{ $work->name }}</h2></span>
                            @if($work->categories->count())
                                <span class="portfolio-item-category">{{ $work->categories->pluck('name')->join(', ') }}</span>
                            @endif
                        </div>
                    </div>
                </a>
            </div>
        @endforeach
    </div>

    <div class="pagination-container">
        {{ $works->links() }}
    </div>
</div>
