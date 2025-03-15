@extends('layouts.default')

@section('main-content')
<article class="work-detail">
    <div class="content-container">
        <div class="work-detail-header">
            <div class="work-meta">
                <h1>{{ $work->name }}</h1>
                <div class="meta-items">
                @if($work->live_url)
                    <a href="{{ $work->live_url }}" class="btn second work-url" target="_blank">
                        <span>View Live <i class="bi bi-box-arrow-up-right"></i></span>
                    </a>
                @endif
                    @if($work->project_date)
                        <div class="meta-item">
                            <i class="bi bi-calendar"></i>
                            {{ $work->project_date->format('M Y') }}
                            @if($work->ongoing)
                                - Ongoing
                            @endif
                        </div>
                    @endif
                    @if($work->categories->count())
                        <div class="meta-item">
                            <i class="bi bi-tag"></i>
                            {{ $work->categories->pluck('name')->join(', ') }}
                        </div>
                    @endif
                </div>
            </div>
            <div class="work-content">
                {!! $work->description !!}
            </div>
        </div>

        @if($work->images)
            <div class="work-images">
                <div class="swiper">
                    <div class="swiper-wrapper">
                        @foreach($work->images as $image)
                            <div class="swiper-slide">
                                <img src="{{ asset('storage/' . $image) }}" alt="{{ $work->name }}">
                            </div>
                        @endforeach
                    </div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>
                </div>
            </div>
        @elseif($work->content)
            <div class="work-content-body">
                {!! str($work->content)
                    ->replaceMatches('/<p>&nbsp;<\/p>/', '')
                    ->replaceMatches('/<p><\/p>/', '')
                    ->replaceMatches('/<figure>(.*?)<figcaption>.*?<\/figcaption><\/figure>/', '<figure>$1</figure>')
                    ->sanitizeHtml() !!}
            </div>
        @endif
    </div>
</article>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        updateOnWindowResize: true,
        observer: true,
        observeParents: true,
        autoHeight: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});
</script>
@endpush
