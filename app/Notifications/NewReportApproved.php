<?php

namespace App\Notifications;

use App\Mail\ReportApprovedMail;
use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReportApproved extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Report $report)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): Mailable
    {
        return (new ReportApprovedMail($this->report))
            ->to($notifiable->email);
    }


    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => 'New notification'
        ]);
    }


    /**
     * Get the type of the notification being broadcast.
     */
    public function broadcastType(): string
    {
        return 'new.report.approved';
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'report_id' => $this->report->id,
            'link' => url(route('admin.report.open', ['report_id' => $this->report->id])),
            'title' => $this->report->submission_bin->title . ': ' . $this->report->unitHead->firstname . ' ' . $this->report->unitHead->lastname . ' submitted a report',
            'type' => 'report_submission'
        ];
    }
}
