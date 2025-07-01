@extends('layouts.default')

@section('main-content')
<section class="contact-section">
    <div class="content-container">
        <div class="contact-layout">
            <div class="contact-title">
                <h1><a class="line-ani" href="mailto:hello@emils.graphics">hello@emils.graphics</a></h1>
                <p class="main-contact-text">I'm ready to work with you on your next project. Fill out the form and I'll get back to you as fast possible.</p>
                <div class="contact-information">
                    <ul class="special">
                        <li>
                            <div>
                                <div>
                                    <h4>Address</h4>
                                    <p>Ydrevägen 5B, 573 35 Tranås</p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+46 760 08 85 92</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div><!-- contact-title -->
            <div class="contact-form-container">
                @if(session('error'))
                    <div class="alert danger">
                        {{ session('error') }}
                    </div>
                @endif

                @if ($errors->any())
                    <div class="alert danger">
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                @if(session('success'))
                    <div class="alert success">
                        {{ session('success') }}
                    </div>
                @endif
                <form action="{{ route('contact.submit') }}" method="POST" class="contact-form" id="contactForm">
                    @csrf
                    <div class="form-group">
                        <input class="fancy" type="text" id="name" name="name" placeholder="Name" value="{{ old('name') }}" required>
                    </div>
                    
                    <div class="form-group">
                        <input class="fancy" type="email" id="email" name="email" placeholder="Email" value="{{ old('email') }}" required>
                    </div>
                    
                    <div class="form-group">
                        <textarea class="fancy" data-gramm="false" minlength="20" id="message" name="message" placeholder="Message" required>{{ old('message') }}</textarea>
                    </div>
                    
                    <button type="submit" class="btn animate-arrow g-recaptcha" data-sitekey="6Lc1Y3QrAAAAAL3iBeJqRZkq1wUhovMX5KKDDDfk" data-callback="onSubmit" data-action="submit">
                        <span class="text" data-pan="contact-button-front">Send Message</span>
                        <svg class="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path fill="currentColor" d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z"></path><path class="arrow-icon-stem" stroke="currentColor" d="M1.75 8H11" stroke-width="1.5" stroke-linecap="round"></path>
                        </svg>
                    </button>

                     <script>
                        function onSubmit(token) {
                            document.getElementById("contactForm").submit();
                        }
                    </script>
                </form>
            </div><!-- contact-form-container -->
        </div><!-- contact-layout -->
    </div><!-- content-container -->
    <div class="framer-inner-2"></div>
</section>
<section class="reason-contact-page">
    <div class="content-container">
        <div class="grid-300-gap-5 grid">
            <div>
                <img src="{{ asset('images/icons/9.png') }}" loading="lazy" width="50" alt="" class="landing-callout_icon">
                <h3 class="h4">15+ Years of Expertise in Web Development & Graphic Design</h3>
                <div>With years of experience comes deep industry knowledge and adaptability. No project is too big or complex, I take pride in delivering exceptional results in any environment.</div>
            </div>
            <div>
                <img src="{{ asset('images/icons/15.png') }}" loading="lazy" width="50" alt="" class="landing-callout_icon">
                <h3 class="h4">A Thriving Client Base & Outstanding Customer Support</h3>
                <div>I've built lasting relationships with dozens of active clients by focusing on quality and satisfaction. My job isn't done until you're completely happy with the results.</div>
            </div>
            <div>
                <img src="{{ asset('images/icons/12.png') }}" loading="lazy" width="50" alt="" class="landing-callout_icon">
                <h3 class="h4">Performance & Security: The Foundation of Every Project</h3>
                <div>Slow, vulnerable websites are not an option. I write optimized, secure PHP code using the latest best practices, including PDO for SQL security and robust performance enhancements.</div>
            </div>
            <div>
                <img src="{{ asset('images/icons/14.png') }}" loading="lazy" width="50" alt="" class="landing-callout_icon">
                <h3 class="h4">Seamless Web Management & Premium Execution</h3>
                <div>From ongoing content updates to promotional pages and graphic enhancements, I provide top-tier web management services to keep your online presence fresh and engaging.</div>
            </div>
            <div>
                <img src="{{ asset('images/icons/13.png') }}" loading="lazy" width="50" alt="" class="landing-callout_icon">
                <h3 class="h4">SEO-Optimized Development for Maximum Visibility</h3>
                <div>SEO isn't an afterthought—it's embedded into every page I create. From structured metadata to social media previews, I ensure your website ranks well and looks great when shared.</div>
            </div>
            <div>
                <img src="{{ asset('images/icons/11.png') }}" loading="lazy" width="50" alt="" class="landing-callout_icon">
                <h3 class="h4">Have a Unique Request? Feel Free to Ask</h3>
                <div>Whether it's web development, graphic design, or video production, I can handle a wide range of digital needs. If I can't deliver exactly what you need, I'll be upfront about it—no false promises.</div>
            </div>
        </div>
    </div>
</section>
@endsection
