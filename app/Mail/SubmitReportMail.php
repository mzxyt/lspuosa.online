<?php

namespace App\Mail;

use App\Models\AppSettings;
use App\Models\Report;
use App\Models\SubmissionBin;
use App\Models\UnitHead;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubmitReportMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public SubmissionBin $submission, public User $unitHead)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Submit Your Report',
            from: new Address('no-reply.osaemailsystem@gmail.com', 'LSPU Super Admin'),
            to: $this->unitHead->email
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.submit-report',
            with: [
                'url' => url(route("unit_head.submission_bin", ['id' => $this->submission->id])),
                'logo' => AppSettings::first()->logo,
                'unit_head' => $this->unitHead,
                'submission_bin' => $this->submission,
                'deadline_date' => Carbon::parse($this->submission->deadline_date . $this->submission->deadline_time)->format('MMM d, Y / hh:mm aaa')
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
