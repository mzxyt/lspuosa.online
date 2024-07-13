<?php

namespace App\Mail;

use App\Models\AppSettings;
use App\Models\Report;
use App\Models\campusAdmin;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewCampusAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public User $campusAdmin)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to OSA SYSTEM!',
            from: new Address('no-reply.osaemailsystem@gmail.com', 'LSPU Super Admin'),
            to: $this->campusAdmin->email
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.new-campus-admin',
            with: [
                'url' => url(route("welcome")),
                'logo' => AppSettings::first()->logo,
                'campus_admin' => $this->campusAdmin
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
