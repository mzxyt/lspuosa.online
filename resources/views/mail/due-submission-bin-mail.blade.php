<x-mail::message :logo="$logo">
# {{$submissionBin->title}}

<!-- # Submission is due today! -->

<hr>

DUE TODAY

#

#

Hi, the submission for your report is due today!


<x-mail::button :align="'left'" :url="$url">
Open Submission bin
</x-mail::button>

</x-mail::message>
