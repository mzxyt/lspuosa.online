<?php

namespace App\Console\Commands;

use App\Models\CalendarEvent;
use App\Models\User;
use App\Notifications\CalendarEventNotification;
use Illuminate\Console\Command;

class NotificationForEventsToday extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:event-notifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Make Notifications for today\'s events';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //find events for today's date
        $calendarEvents = CalendarEvent::whereRaw('notified = false && type = ? AND (DATE(start) = CURDATE() OR (CURDATE() > DATE(start) AND DATE(end) < CURDATE()))', ['event'])->get();

        $users = User::all();
        $made = 0;
        foreach ($users as $key => $user) {
            foreach ($calendarEvents as $key => $event) {
                $user->notify(new CalendarEventNotification($event));
                $made++;
                $event->notified = true;
                $event->save();
            }
        }

        echo 'made ' . $made . ' event notification(s).';
    }
}
