<a href="{{ route('home') }}" class="{{ request()->routeIs('home') ? 'active' : '' }}{{ isset($isFooter) ? ' line-ani' : '' }}">Home</a>
<span>/</span>
<a href="{{ route('work') }}" class="{{ request()->routeIs('work') ? 'active' : '' }}{{ isset($isFooter) ? ' line-ani' : '' }}">Work</a>
<span>/</span>
<a href="{{ route('about') }}" class="{{ request()->routeIs('about') ? 'active' : '' }}{{ isset($isFooter) ? ' line-ani' : '' }}">About</a>
<span>/</span>
<a href="{{ route('blog.index') }}" class="{{ request()->routeIs('blog.*') ? 'active' : '' }}{{ isset($isFooter) ? ' line-ani' : '' }}">Blog</a>
<span>/</span>
<a href="{{ route('contact') }}" class="{{ request()->routeIs('contact') ? 'active' : '' }}{{ isset($isFooter) ? ' line-ani' : '' }}">Contact</a>