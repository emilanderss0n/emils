<div class="portfolio-grid">
    @foreach($works as $work)
        <div class="portfolio-grid-item">
            <a href="{{ route('work.show', $work) }}" class="portfolio-item-link">
                <div class="portfolio-item-thumbnail">
                    @if($work->thumbnail)
                        <img src="{{ asset('storage/' . $work->thumbnail) }}" alt="{{ $work->name }}">
                    @endif
                    <div class="portfolio-item-hover">
                    @if($work->categories->count())
                        <span class="portfolio-item-category">{{ $work->categories->pluck('name')->join(', ') }}</span>
                    @endif
                        <span class="portfolio-item-title"><h2>{{ $work->name }}</h2></span>
                    </div>
                </div>
            </a>
        </div>
    @endforeach
</div>
<div class="pagination-container">
    {{ $works->links() }}
</div>
