@extends('layouts.default')

@section('main-content')
<section class="hero-section">
    <div class="content-container">
        <div class="hero-content">
            <div class="presentation">
                <h1>I have been busy<br><span class="gradient-text">creating my own virtual universe</span></h1>
                <p>
                Hello, my name is <strong>Emil Andersson</strong>. I'm a passionate Graphic Designer, Web Developer, 3D Artist and Video Editor from Sweden. Scroll down to see what services I can help you with.
                </p>
                <div class="hero-actions">
                    <a class="btn" href="{{ route('work') }}" data-pan="work-button-front">Portfolio</a>
                    <a class="btn second" href="{{ route('about') }}" data-pan="profile-button-front">Profile</a>
                </div>
            </div>
            <div class="hero-image">
                <img src="{{ asset('images/presentationImage.png') }}" alt="Emil Andersson" />
                <div class="fill"></div>
            </div>
        </div>
    </div>
    <div class="framer-inner-1"></div>
    <div class="framer-inner-2"></div>
</section>

<section class="front-portfolio">
    <div class="content-container">
        <div class="front-portfolio-top">
            <h2 class="front-portfolio-title dec-title"><span><i class="bi bi-suitcase-lg"></i></span> Latest work</h2>
            <a class="btn-Fx" href="{{ route('work') }}"><span>Show All <i class="bi bi-arrow-right"></i></span></a>
        </div>
        <div class="front-portfolio-list">
            @foreach($latestWorks as $work)
                <div class="front-portfolio-item">
                    <a href="{{ route('work.show', $work) }}">
                        <div class="front-portfolio-item-thumbnail">
                            @if($work->thumbnail)
                                <img src="{{ asset('storage/' . $work->thumbnail) }}" loading="lazy" alt="{{ $work->name }}">
                            @endif
                            <div class="portfolio-item-hover desktop-only">
                                <span class="portfolio-item-category">
                                @if($work->categories->count())
                                    {{ $work->categories->pluck('name')->join(', ') }}
                                @endif
                                </span>
                                <span class="portfolio-item-title"><h2>{{ $work->name }}</h2></span>
                            </div>
                        </div>
                        <span class="front-portfolio-item-category mobile-only">
                        @if($work->categories->count())
                            {{ $work->categories->pluck('name')->join(', ') }}
                        @endif
                        </span>
                        <div class="front-portfolio-item-title mobile-only">
                            <h2>{{ $work->name }}</h2>
                        </div>
                    </a>
                </div>
            @endforeach
        </div>
    </div>
</section>

<section class="services">
    <div class="content-container">
        <div class="services-grid">
            <div class="service-item framer pink" aria-label="Web Development" tabindex="0" role="button">
                <div class="framer-content">
                    <div class="service-icon gradient-icon">
                        <i class="bi bi-code-square"></i>
                        <h3>Web Development</h3>
                    </div>
                    <p class="pretty-wrap">Experience a comprehensive web development process where engineering is integrated at every stage. Employing a holistic approach, I ensure the creation of reliable and intuitive web applications tailored to elevate your business.</p>
                    <div class="service-skills tags">
                        <div class="tag">
                            <span>Front-end</span>
                        </div>              
                        <div class="tag">
                            <span>CSS / LESS</span>
                        </div>
                        <div class="tag">
                            <span>Javascript</span>
                        </div>
                        <div class="tag">
                            <span>PHP</span>
                        </div>
                        <div class="tag">
                            <span>Back-end</span>
                        </div>
                        <div class="tag">
                            <span>SQL</span>
                        </div>
                    </div>
                </div>
                <div class="framer-inner-1"></div>
                <div class="framer-inner-2"></div>
            </div>

            <div class="service-item framer purple" aria-label="Graphic Design" tabindex="0" role="button">
                <div class="framer-content">
                    <div class="service-icon gradient-icon">
                        <i class="bi bi-palette"></i>
                        <h3>Graphic Design</h3>
                    </div>
                    <p class="pretty-wrap">With 16 years of graphic design prowess, I deliver meticulously crafted and original designs optimized for diverse devices. My toolset primarily includes Adobe Photoshop and Illustrator, ensuring stunning visuals across various mediums.</p>
                    <div class="service-skills tags">
                        <div class="tag">
                            <span>User interface</span>
                        </div>
                        <div class="tag">
                            <span>Websites</span>
                        </div>
                        <div class="tag">
                            <span>Mobile apps</span>
                        </div>
                        <div class="tag">
                            <span>Software</span>
                        </div>
                        <div class="tag">
                            <span>Graphics</span>
                        </div>
                        <div class="tag">
                            <span>Physical print</span>
                        </div>
                        <div class="tag">
                            <span>Brand identity</span>
                        </div>
                        <div class="tag">
                            <span>Media</span>
                        </div>
                    </div>
                </div>
                <div class="framer-inner-1"></div>
                <div class="framer-inner-2"></div>
            </div>

            <div class="service-item framer blue" aria-label="3D Design" tabindex="0" role="button">
                <div class="framer-content">
                    <div class="service-icon gradient-icon">
                        <i class="bi bi-box"></i>
                        <h3>3D Design</h3>
                    </div>
                    <p class="pretty-wrap">Transforming concepts into captivating realities, I specialize in creating breathtaking 3D visualizations for architecture and game textures. Utilizing tools like Blender, Substance Painter, and Photoshop, I bring visions to life with unparalleled realism.</p>
                </div>
                <div class="framer-inner-1"></div>
                <div class="framer-inner-2"></div>
            </div>

            <div class="service-item framer cyan" aria-label="Motion Design" tabindex="0" role="button">
                <div class="framer-content">
                    <div class="service-icon gradient-icon">
                        <i class="bi bi-film"></i>
                        <h3>Motion Design</h3>
                    </div>
                    <p class="pretty-wrap">Elevate your brand with captivating video content crafted to stand out in today's digital landscape. From video editing in Premiere Pro to special effects creation in After Effects, I offer expertise in producing dynamic and engaging motion graphics tailored to your needs.</p>
                </div>
                <div class="framer-inner-1"></div>
                <div class="framer-inner-2"></div>
            </div>
        </div>
    </div>
</section>

<section class="front-blog">
    <div class="content-container">
        <div class="front-blog-top">
            <h2 class="front-blog-title dec-title"><span><i class="bi bi-journal-text"></i></span> Latest Posts</h2>
            <a class="btn-Fx" href="{{ route('blog.index') }}"><span>View Blog <i class="bi bi-arrow-right"></i></span></a>
        </div>
        <div class="front-blog-list">
            @foreach($latestPosts as $post)
                <a class="front-blog-item article-blog" href="{{ route('blog.show', $post->slug) }}" aria-label="{{ $post->title }}">
                    <div class="front-blog-item-thumbnail article__thumbnail" style="background-image: url('{{ asset('storage/' . $post->thumbnail) }}')">
                    </div>
                    <div class="front-blog-item-content article__body">
                        <div>
                            <h3 class="article__title">{{ $post->title }}</h3>
                        </div>
                        <div class="article__excerpt">
                            <p>{{ Str::limit(html_entity_decode(strip_tags($post->content)), 160) }}</p>
                        </div>
                        <footer class="article__footer">
                            <span class="article__date">{{ $post->created_at->format('M d, Y') }}</span>
                            <div class="footer__readmore">
                                <span class="footer__readmore-text">Read more</span>
                                <span class="footer__readmore-arrow">
                                    <i class="bi bi-arrow-right"></i>
                                </span>
                            </div>
                        </footer>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</section>

<div class="call-to-action">
    <div class="content-container">
        <div class="call-content">
            <h1>Should we work together?</h1>
            <a class="btn animate-arrow" href="{{ route('contact') }}">
                <span class="text" data-pan="contact-button-front">Contact me</span>
                <svg class="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path fill="currentColor" d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z"></path><path class="arrow-icon-stem" stroke="currentColor" d="M1.75 8H11" stroke-width="1.5" stroke-linecap="round"></path>
                </svg>
            </a>
        </div>
    </div>
    <div class="framer-inner-1"></div>
    <div class="framer-inner-2"></div>
</div>

@endsection