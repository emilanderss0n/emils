@extends('layouts.default')

@section('main-content')
<section class="blog-section">
    <div class="content-container">
        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif
        @if (session('error'))
            <div class="alert alert-danger">
                {{ session('error') }}
            </div>
        @endif

        <div class="blog-header">
            <h1 class="page-title"><i class="bi bi-journal-text"></i> Blog</h1>
            <form id="subscribe-form" class="newsletter-form">
                @csrf
                <div class="form-group">
                    <input type="email" name="email" id="subscriber-email" placeholder="Subscribe to newsletter" required>
                    <button type="submit" class="btn-Fx"><span>Subscribe <i class="bi bi-arrow-right"></i></span></button>
                </div>
                <div id="subscription-message"></div>
            </form>
        </div>
        
        <div class="blog-grid">
            @foreach($posts as $post)
                <div class="blog-item">
                    <a href="{{ route('blog.show', $post) }}">
                        @if($post->thumbnail)
                        <div class="blog-thumbnail-wrapper">
                            <div class="blog-thumbnail">
                                <img src="{{ asset('storage/' . $post->thumbnail) }}" loading="lazy" alt="{{ $post->title }}">
                            </div>
                        </div>
                        @endif
                        <div class="blog-meta">
                            <span class="blog-date"><i class="bi bi-clock"></i> {{ $post->created_at->format('M d, Y') }}</span>
                        </div>
                        <div class="blog-content">
                            <h2>{{ $post->title }}</h2>
                            <p>{!! Str::limit($post->excerpt, 220) !!}</p>
                        </div>
                    </a>
                </div>
            @endforeach
        </div>
        
        {{ $posts->links() }}
    </div>
</section>

@push('scripts')
<script>
document.addEventListener('submit', function(e) {
    if (e.target.id === 'subscribe-form') {
        e.preventDefault();
        const email = document.getElementById('subscriber-email').value;
        const messageDiv = document.getElementById('subscription-message');
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        fetch('{{ route("blog.subscribe") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.textContent = data.message;
            messageDiv.className = data.success ? 'success-message' : 'error-message';
            if (data.success) {
                document.getElementById('subscriber-email').value = '';
            }
        })
        .catch(error => {
            messageDiv.textContent = 'An error occurred. Please try again.';
            messageDiv.className = 'error-message';
        });
    }
});
</script>
@endpush
@endsection
