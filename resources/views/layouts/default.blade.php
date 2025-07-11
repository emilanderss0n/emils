<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

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
        <link rel="stylesheet" href="{{ asset('vendor/swiper/swiper-bundle.min.css') }}">
        <script src="{{ asset('vendor/swiper/swiper-bundle.min.js') }}" defer></script>

        <!-- ScrollReveal -->
        <script src="{{ asset('vendor/scrollreveal/scrollreveal.min.js') }}"></script>

        @if(Request::is('blog/*'))
        <link href="{{ asset('vendor/prism/prism.css') }}" rel="stylesheet">
        <script src="{{ asset('vendor/prism/prism.js') }}" defer></script>
        @endif

        <!-- Styles / Scripts -->
        @vite(['resources/css/dashxe.css', 'resources/css/app.css', 'resources/js/app.js'])

        @if(app()->environment('production') && env('GOOGLE_ANALYTICS_ID'))
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ env('GOOGLE_ANALYTICS_ID') }}"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '{{ env('GOOGLE_ANALYTICS_ID') }}');
        </script>
        @endif

        @livewireStyles
    </head>
    <body>
        <header>
            <div class="header-cont">
                <div class="header-title">
                    <a class="logo" href="/"><img class="logo-img" height="35" width="68" src="{{ asset('images/logo-2x.png') }}" alt="Emil Andersson logotype"></a>
                </div>
                <div class="flex-row-reverse gap-1">
                    <div class="top-search">
                        <button type="button" id="search-trigger" class="search-button">
                            <i class="bi bi-search"></i>
                        </button>
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
        
        @include('partials.search-overlay')
        
        @stack('scripts')
        <script src="{{ asset('vendor/lenis/lenis.min.js') }}"></script>

        @if(Request::is('/'))
        <script>
            // Only load dotlottie-player script on desktop devices and home page
            if (window.matchMedia("(min-width: 1240px)").matches) {
                const script = document.createElement('script');
                script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
                script.type = "module";
                document.head.appendChild(script);
            }
        </script>

        <script src="{{ asset('vendor/gsap/gsap.min.js') }}"></script> 
        <script src="{{ asset('vendor/gsap/ScrollTrigger.min.js') }}"></script>

        <script>
            document.addEventListener('DOMContentLoaded', function () {

            ScrollTrigger.create({
                start: 'top -400',
                end: 99999,
                toggleClass: { className: 'scrolled', targets: '.hero-content' }
            });

            // Hide scroller-start when contact-me comes into view
            ScrollTrigger.create({
                trigger: '.contact-me',
                start: 'top bottom',
                onEnter: () => {
                    gsap.to('.scroller-start-wrapper', {
                        y: -200,
                        duration: 1
                    });
                },
                onLeaveBack: () => {
                    gsap.to('.scroller-start-wrapper', {
                        y: 100,
                        duration: 1,
                    });
                }
            });

            // Pin sections for proper scroll behavior
            ScrollTrigger.create({
                trigger: '.scroller-start',
                start: 'top top',
                pin: true,
                pinSpacing: false
            });

            ScrollTrigger.create({
                trigger: '.portfolio-grid-scroller',
                start: 'top top',
                pin: false,
            });

            ScrollTrigger.create({
                trigger: '.contact-me',
                start: 'bottom bottom',
                end: 'bottom bottom',
                pin: true,
                pinSpacing: true
            });

            ScrollTrigger.create({
                trigger: '.contact-me',
                start: 'bottom bottom',
                toggleClass: { targets: '.portfolio-grid-wrapper', className: "scrolled" }
            });
        });
        </script>
        @endif

        @livewireScripts
        
        <script src="https://www.google.com/recaptcha/api.js"></script>
    </body>
</html>
