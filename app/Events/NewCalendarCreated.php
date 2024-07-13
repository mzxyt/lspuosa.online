<?php

namespace App\Events;

use App\Models\CalendarEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewCalendarCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public CalendarEvent $calendar;
    /**
     * Create a new event instance.
     */
    public function __construct($calendar)
    {
        $this->calendar = $calendar;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
