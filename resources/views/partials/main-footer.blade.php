<div class="footer">
    <div class="container">
        <div class="left">
            <div id="footer-title">
                <a href="https://emils.graphics">emils<span>.graphics</span></a>
            </div>
            <div class="social-footer">
                <div class="social-links">
                    <a href="https://twitter.com/bobemil_sw13" aria-label="Emil Andersson on Twitter" target="_blank"><i class="bi bi-twitter"></i></a>
                    <a href="https://dribbble.com/emilandersson" aria-label="Emil Andersson on Dribbble" target="_blank"><i class="bi bi-dribbble"></i></a>
                    <a href="https://www.instagram.com/emil_andersson89/" aria-label="Emil Andersson on Instagram" target="_blank"><i class="bi bi-instagram"></i></a>
                    <a href="https://github.com/emilanderss0n" aria-label="Emil Andersson on GitHub" target="_blank"><i class="bi bi-github"></i></a>
                    <a href="https://codepen.io/emilandersson" aria-label="Emil Andersson on CodePen" target="_blank"><i class="bi bi-braces-asterisk"></i></a>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="nav-footer">
            @include('partials.main-nav', ['isFooter' => true])
            </div>
            <div class="nav-footer">
            @include('partials.misc-nav', ['isFooter' => true])
            </div>
        </div>
    </div>
    <div class="info-footer">
        <div class="left">
            <img src="{{ asset('images/logo-2x.png') }}" alt="Emil Andersson logo">
            <p>Copyright © 2025 Emil Andersson</p>                </div>
        <div class="right">
        Built on Laravel, Filament, Vite
        </div>
    </div>
</div>