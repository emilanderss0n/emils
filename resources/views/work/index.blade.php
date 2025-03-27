@extends('layouts.default')

@section('main-content')
<section class="work-main">
    <div class="content-container">
        @livewire('work-portfolio', ['category' => request('category')])

        <div class="github-component">
            <div id="githubContent" class="grid-400-gap-3"></div>
        </div>
    </div>
</section>
@endsection
