<?php

namespace App\Listeners;

use App\Events\SubmissionBinCreated;
use App\Models\User;
use App\Notifications\NewSubmissionBin;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class NotifyUnitHead
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(SubmissionBinCreated $event): void
    {
        $users = User::whereHasRole(['admin','unit_head'])->get();
        Notification::send($users, new NewSubmissionBin($event->submissionBin));
    }
}
