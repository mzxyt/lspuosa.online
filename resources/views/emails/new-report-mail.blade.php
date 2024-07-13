<x-mail::message :logo="$logo">
    <div class="">
        <a href="{{ $url_submission_bin }}" class="flex">
            <span>{{ $report->submission_bin->title }}</span>
            <div><img style="margin-left: 10px;" src="{{ asset('images/share-square-16.png') }}" /></div>
        </a>
    </div>
    <hr>

    SUBMITTED REPORT

    #

    #

    <div class="flex">
        <div>
            <img src="{{ asset('images/document-16.png') }}" />
        </div>
    </div>

    <x-mail::button :align="'left'" :url="$url">
        View report
    </x-mail::button>

    #
    #
    <small>Submitted on {{ $report->created_at }}</small>


</x-mail::message>
