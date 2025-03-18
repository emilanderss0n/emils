@extends('layouts.default')

@section('main-content')
<section class="work-main">
    <div class="content-container">
        @livewire('work-portfolio', ['category' => request('category')])
    </div>
</section>
@endsection
