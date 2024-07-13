<x-mail::message :logo="$logo">
# Calendar Event
Today is the day!
<div class="calendar-event">
<div class="calendar-header"></div>
<div class="calendar-event-date">
<div>
<div class="date">
{{date('d',strtotime($event->start))}}
</div>
<h3>{{$event->title}}</h3>
</div>
</div>
</div>


<x-mail::button :align="'left'" :url="$url">
Access System
</x-mail::button>

</x-mail::message>
