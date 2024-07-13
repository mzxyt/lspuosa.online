<?php

namespace App\Mail;

use App\Models\AppSettings;
use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReportApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public Report $report)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Submitted Report',
            from: new Address('no-reply.osaemailsystem@gmail.com', $this->report->unitHead->firstname . ' ' . $this->report->unitHead->lastname . ' (LSPU Unit Head)'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.report-approved-mail',
            with: [
                'url' => url(route('admin.report.open', ['report_id' => $this->report->id])),
                'url_submission_bin' => url(route('admin.report.open', ['report_id' => $this->report->id])),
                'logo' => AppSettings::first()->logo,
            ],
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
