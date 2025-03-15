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
                    
                    <button type="submit" class="btn">Send Message</button>
                </form>
            </div><!-- contact-form-container -->
        </div><!-- contact-layout -->
    </div><!-- content-container -->
</section>
@endsection
