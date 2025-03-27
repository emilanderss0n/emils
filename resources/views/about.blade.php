@extends('layouts.default')

@section('main-content')
<section class="about-section">
    <div class="content-container">
        <div class="header-profile">
            <div class="side-profile">
                <div class="scroller-stick">
                    <div class="image-profile">
                        <img src="{{ asset('images/emil-andersson.jpg') }}" alt="Emil Andersson" />
                        <div class="social-profile">
                            <a href="https://twitter.com/bobemil_sw13" target="_blank"><i class="bi bi-twitter"></i></a>
                            <a href="https://github.com/emilanderss0n" target="_blank"><i class="bi bi-github"></i></a>
                            <a href="https://dribbble.com/emilandersson" target="_blank"><i class="bi bi-dribbble"></i></a>
                            <a href="https://www.instagram.com/emil_andersson89/" target="_blank"><i class="bi bi-instagram"></i></a>
                        </div>
                    </div>
                    <div class="toolset">
                        <h3>Preferred Toolset</h3>
                        <div class="icons">
                            <div class="blender">Blender</div>
                            <div class="photoshop">Photoshop</div>
                            <div class="vscode">VS Code</div>
                            <div class="chrome">Chrome</div>
                            <div class="github">GitHub</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="info-profile">
                <h1>Emil Andersson</h1>
                <h2>UI Designer / Web Developer / 3D Artist / Video Editor</h2>
                <p class="about-me">Hello, I was born in a small town Sk&auml;nninge in Sweden 1989. I was kind of shy as kid but very curious of the enviroment around me. My friends were the exact opposite (and we're all still friends today). They helped me come out of my shell. 
                    But to this day, I still need to be in that shell from time to time. In the universe of the Internet, I can relax and be myself. Truly relaxed and very creative.
                    <br><br>
                    At 20, fueled by youthful energy and a hunger for something more, a friend and I decided to start our own thing - Delive Solutions. Our first clients loved what we did with their websites. I still see some of them cruising around with the branding we made for them. 
                    But after a few years, we both felt the need to move on. I wanted to explore the world of 3D art and game development. So I did. I've now worked with people from all over the world. Mostly on web design and game development projects. It's so fun meeting people with 
                    different backgrounds and ideas. It's like a never-ending source of inspiration.
                    <br><br>
                    Now, at 35, I'm on the lookout for creative opportunities or a chance to join your creative team. Proficient in web development, graphic design, video editing, and 3D art, I'm poised to make a meaningful impact. If you're interested, <a href="{{ route('contact') }}" class="line-ani">drop me a line</a>
                </p>
            </div>
        </div>
    </div>
</section>
<section class="reason-contact-page about">
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
