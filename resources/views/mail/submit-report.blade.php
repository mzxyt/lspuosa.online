<x-mail::message>
# Submit your report, {{$unit_head->firstname}}.

Submission bin <b>{{ $submission_bin->title }}</b> is due on <b>{{ $deadline_date }}</b>. Please submit your report now!
<hr/>

#

<x-mail::button :align="'left'" :url="$url">
View report
</x-mail::button>

<br>
</x-mail::message>
