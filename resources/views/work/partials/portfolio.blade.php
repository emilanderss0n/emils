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
<div class="pagination-container">
    {{ $works->links() }}
</div>
