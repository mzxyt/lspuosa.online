<x-mail::message>
# Welcome to OSA SYSTEM, {{$campus_admin->firstname}}!

You've been added as a campus admin of {{$campus_admin->campus->name}}.
<hr/>

#

<x-mail::button :align="'left'" :url="$url">
Log in to your account
</x-mail::button>

<br>
</x-mail::message>
