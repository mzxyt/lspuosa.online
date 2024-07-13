<?php

namespace App\Events;

use App\Models\ReportComment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewCommentAdded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $afterCommit = true;
    public ReportComment $reportComment;

    /**
     * Create a new event instance.
     */
    public function __construct(ReportComment $comment)
    {
        $this->reportComment = $comment;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new PrivateChannel('comments.' . $this->reportComment->submission_bin_id . '.' . $this->reportComment->unit_head_id);
    }

    public function broadcastAs(){
        return 'new-comment';
    }

    // public function broadcastWith()
    // {
    //     $data['comments'] = ReportComment::where('submission_bin_id', $this->reportComment->submission_bin_id)->where('unit_head_id', $this->reportComment->unit_head_id)->get();
    //     return $data;
    // }
}
