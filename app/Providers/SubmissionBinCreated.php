<?php

namespace App\Providers;

use App\Models\SubmissionBin;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SubmissionBinCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public SubmissionBin $submissionBin;
    /**
     * Create a new event instance.
     */
    public function __construct(SubmissionBin $submissionBin)
    {
        //
        $this->submissionBin = $submissionBin;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    // public function broadcastOn(): array
    // {
    //     return [
    //         new PrivateChannel('channel-name'),
    //     ];
    // }
}
