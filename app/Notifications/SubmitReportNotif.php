<?php

namespace App\Notifications;

use App\Mail\NewCommentMail;
use App\Mail\NewUnitHeadMail;
use App\Mail\SubmitReportMail;
use App\Models\ReportComment;
use App\Models\SubmissionBin;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubmitReportNotif extends Notification implements ShouldQueue
{
  use Queueable;

  /**
   * Create a new notification instance.
   */
  public function __construct(public SubmissionBin $submission, public User $unitHead)
  {
    $this->afterCommit();
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
    return(new SubmitReportMail($this->submission, $this->unitHead))
      ->to($notifiable->email);
  }

  /*
   *
   * Broadcast notifications
   */

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
    return 'notification.unitHead';
  }

  /**
   * Get the array representation of the notification.
   *
   * @return array<string, mixed>
   */
  public function toArray(object $notifiable): array
  {
    return [
      'submission_bin_id' => $this->submission->id,
      'link' => url(route('unit_head.submission_bin', ['id' => $this->submission->id])),
      'title' => $this->submission->title . "'s deadline is almost near.",
      'type' => 'submission_bin'
    ];
  }
}
