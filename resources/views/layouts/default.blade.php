<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @if(isset($blog))
            <x-meta-tags :blog="$blog" />
        @else
            <x-meta-tags 
                title="Emil // Digital Art Creator"
                description="Portfolio by Emil Andersson. Emil is a Graphic Designer, Web Developer, 3D Artist, Video Editor from Sweden."
            />
        @endif

        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/favicon/apple-touch-icon.png') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicon/favicon-32x32.png') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('images/favicon/favicon-16x16.png') }}">

        <!-- Fonts -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet">
        
        <!-- Swiper.js -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

        <!-- Styles / Scripts -->
        @vite(['resources/css/dashxe.css', 'resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body>
        <header>
            <div class="header-cont">
                <div class="header-title">
                    <a href="/"><img height="35" width="68" src="{{ asset('images/logo-2x.png') }}" alt="Emil Andersson logotype"></a>
                </div>
                <div class="flex-row-reverse gap-1">
                    <div class="top-search">
                        <form action="{{ route('search') }}" method="GET" class="search-form">
                            <div class="search-input-wrapper">
                                <i class="bi bi-search search-icon"></i>
                                <input type="text" 
                                    name="q" 
                                    placeholder="Search..." 
                                    value="{{ request('q') }}"
                                    class="search-input">
                            </div>
                        </form>
                    </div>
                    <nav id="main-menu">
                        <div class="main-menu-container">
                            @include('partials.main-nav')
                        </div>
                        <a id="nav-mobile" href="javascript:void(0)">
                            <div class="line-1 line"></div>
                            <div class="line-2 line"></div>
                            <div class="line-3 line"></div>
                        </a>
                        <div class="mobile-nav">
                            <div class="mobile-nav-container">
                                @include('partials.main-nav')
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
        <main>
            @yield('main-content')
        </main>
        <footer>
            @include('partials.main-footer')
        </footer>
        <script src="https://unpkg.com/scrollreveal"></script>
        @stack('scripts')
    </body>
</html>
