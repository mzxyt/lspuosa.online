<x-mail::message :logo="$logo">
<div class="">
<a href="{{$url_submission_bin}}" class="flex">
<span>{{$report->submission_bin->title}}</span>
</a>
</div>
<hr>

SUBMITTED REPORT

#

#

<div class="flex">
<div>
    <img src="{{asset('images/document-16.png')}}"/>
</div>
<small>
@if (count($report->attachments) > 1)
    Report has {{count($report->attachments)}} attachments.
@else
        {{$report->attachments[0]->name}}
@endif
</small>
</div>

<x-mail::button :align="'left'" :url="$url">
View report
</x-mail::button>

#
#
<small>Submitted on {{$report->created_at}}</small>


</x-mail::message>
