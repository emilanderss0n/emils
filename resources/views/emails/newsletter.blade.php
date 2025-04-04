<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $template->subject }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eaeaea;
        }
        .content {
            background: #fff;
            padding: 30px 20px;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eaeaea;
            margin-top: 30px;
        }
        .footer a {
            color: #2151b1;
            text-decoration: underline;
        }
        img {
            max-width: 100%;
            height: auto;
        }
        h1, h2, h3 { color: #2151b1; }
        p { margin-bottom: 1em; }
        .header img {
            max-width: 150px;
            height: auto;
        }
        .latest-posts {
            margin: 40px 0;
            padding: 20px;
            border-top: 1px solid #eaeaea;
        }
        .latest-posts h2 {
            text-align: center;
            margin-bottom: 20px;
        }
        .post-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }
        .post-card {
            text-decoration: none;
            color: inherit;
        }
        .post-card img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .post-card h3 {
            font-size: 16px;
            margin: 0 0 5px;
        }
        .post-date {
            font-size: 12px;
            color: #666;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                padding: 10px !important;
            }
            .post-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('images/logo-2x.png') }}" alt="Emil's Graphics" height="35">
        </div>
        <div class="content">
            {!! $template->content !!}
        </div>
        <div class="latest-posts">
            <h2>Latest from the Blog</h2>
            <div class="post-grid">
                @foreach($latestPosts as $post)
                    <a href="{{ route('blog.show', $post) }}" class="post-card">
                        @if($post->thumbnail)
                            <img src="{{ asset('storage/' . $post->thumbnail) }}" alt="{{ $post->title }}">
                        @endif
                        <h3>{{ $post->title }}</h3>
                        <div class="post-date">{{ $post->created_at->format('M d, Y') }}</div>
                    </a>
                @endforeach
            </div>
        </div>
        <div class="footer">
            <p>You're receiving this email because you subscribed to Emil's Graphics newsletter.</p>
            @if($subscriber)
                <p>To unsubscribe, <a href="{{ route('unsubscribe', ['email' => base64_encode($subscriber->email)]) }}">click here</a></p>
            @endif
        </div>
    </div>
</body>
</html>