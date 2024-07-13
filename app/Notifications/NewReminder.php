<?php

namespace App\Notifications;

use App\Models\Announcement;
use App\Models\CalendarEvent;
use App\Models\Reminder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReminder extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Reminder $reminder
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
            ->line('A new reminder has been created.')
            ->action('View Reminders', url(route('admin.reminders')));
    }


    /**
     * Get the type of the notification being broadcast.
     */
    public function broadcastType(): string
    {
        return 'admin.reminders';
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
            'id' => $this->reminder->id,
            'link' => url(route('admin.reminders')),
            'title' => $this->reminder->title,
        ];
    }
}
