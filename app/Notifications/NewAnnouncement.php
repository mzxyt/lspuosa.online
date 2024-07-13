<?php

namespace App\Notifications;

use App\Models\Announcement;
use App\Models\CalendarEvent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewAnnouncement extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Announcement $announcement
    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('A new notification has been posted in the announcements section.')
            ->action('View Announcement', url(route('admin.announcements')));
    }


    /**
     * Get the type of the notification being broadcast.
     */
    public function broadcastType(): string
    {
        return 'admin.announcements';
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
            'id' => $this->announcement->id,
            'link' => url(route('admin.announcements')),
            'title' => $this->announcement->title,
        ];
    }
}
