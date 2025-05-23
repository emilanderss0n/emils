@extends('layouts.default')

@section('main-content')
<section class="error-page-section framer page pink">
    <div class="content-container">
        <div class="error-page">
            <h1>500</h1>
            <h3>Internal Server Error</h3>
            <p>Sorry, the server encountered an unexpected condition that prevented it from fulfilling the request.</p>
            <a href="{{ route('home') }}" class="btn animate-arrow">
                <span class="text" data-pan="contact-button-front">Back to Home</span>
                <svg class="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path fill="currentColor" d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z"></path><path class="arrow-icon-stem" stroke="currentColor" d="M1.75 8H11" stroke-width="1.5" stroke-linecap="round"></path>
                </svg>
            </a>
        </div>
    </div>
    <div class="framer-inner-1"></div>
    <div class="framer-inner-2"></div>
</section>
@endsection
