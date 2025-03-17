<a href="{{ route('home') }}" class="{{ request()->routeIs('home') ? 'active' : '' }}" data-pan="header-nav-home">Home</a>
<span>/</span>
<a href="{{ route('work') }}" class="{{ request()->routeIs('work') ? 'active' : '' }}" data-pan="header-nav-work">Work</a>
<span>/</span>
<a href="{{ route('about') }}" class="{{ request()->routeIs('about') ? 'active' : '' }}" data-pan="header-nav-about">About</a>
<span>/</span>
<a href="{{ route('blog.index') }}" class="{{ request()->routeIs('blog.*') ? 'active' : '' }}" data-pan="header-nav-blog">Blog</a>
<span>/</span>
<a href="{{ route('contact') }}" class="{{ request()->routeIs('contact') ? 'active' : '' }}" data-pan="header-nav-contact">Contact</a>