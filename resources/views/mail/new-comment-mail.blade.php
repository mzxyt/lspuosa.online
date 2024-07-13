<x-mail::message>
# Unit Head Report

{{$reportComment->report->submission_bin->title}}
<hr/>

<small>{{$reportComment->user->firstname}} added a private comment on {{$reportComment->report->submission_bin->title}}</small>

#

<div class="flex">
<div>
<img
width="40"
src="{{$reportComment->user->image}}"
class="profile-pic"
/>
</div>
<div>
<p><strong>{{$reportComment->user->firstname}} {{$reportComment->user->lastname}}</strong></p>
<p>{{$reportComment->comment}}</p>

</div>
</div>



<x-mail::button :align="'left'" :url="$url">
Open Comment
</x-mail::button>

<br>
<small>Added on {{$reportComment->created_at}}</small>
</x-mail::message>
