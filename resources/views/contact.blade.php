@extends('layouts.default')

@section('main-content')
<section class="contact-section">
    <div class="content-container">
        <div class="contact-layout">
            <div class="contact-title">
                <h1>hello@emils.graphics</h1>
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
                <form action="{{ route('contact.submit') }}" method="POST" class="contact-form">
                    @csrf
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="6" required></textarea>
                    </div>
                    
                    <button type="submit" class="btn animate-arrow">
                        <span class="text" data-pan="contact-button-front">Send Message</span>
                        <svg class="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path fill="currentColor" d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z"></path><path class="arrow-icon-stem" stroke="currentColor" d="M1.75 8H11" stroke-width="1.5" stroke-linecap="round"></path>
                        </svg>
                    </button>
                </form>
            </div><!-- contact-form-container -->
        </div><!-- contact-layout -->
    </div><!-- content-container -->
</section>
@endsection
