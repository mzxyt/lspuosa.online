<x-mail::message>
A new submission bin is created
<hr style="background-color: #d3d3d3;color:#d3d3d3;margin-top:2px !important;">

<span></span>

<span></span>

<span style="color: #283593;">
{{$submissionBin->title}}
</span>

<x-mail::button :align="'left'" :color="'primary'" :url="$url">
Open Submission Bin
</x-mail::button>

<br>
<small>Created on {{$submissionBin->created_at}}</small>

</x-mail::message>
