<?php

namespace App\Providers;

use App\Providers\SubmissionBinCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendSubmissionBinNotif
{
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
        //
    }
}
