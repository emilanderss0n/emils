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
                <div class="github-component">
                    <div id="githubContent"></div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
