<a href="{{ route('sitemap', ['format' => 'html']) }}" class="{{ request()->routeIs('sitemap') ? 'active' : '' }}{{ isset($isFooter) ? ' line-ani' : '' }}">Sitemap</a>
<span>/</span>
<a href="{{ route('privacy') }}" class="{{ request()->routeIs('privacy') ? 'active' : '' }}{{ isset($isFooter) ? ' line-ani' : '' }}">Privacy Policy</a>