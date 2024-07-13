<?php

namespace App\Http\Controllers;

use App\Events\NewCalendarCreated;
use App\Models\CalendarEvent;
use App\Models\User;
use App\Models\UserEventsHistory;
use App\Notifications\NewCalendarEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class CalendarEventController extends Controller
{
    public function index(Request $request)
    {
        $data['events'] = CalendarEvent::all();

        // event must have user data get it using user_id
        $data['events'] = $data['events']->map(function ($event) {
            $event->role = User::find($event->user_id)->roles->first()->name;
            // add user role to title for example "Unit Head: Meeting"
            $event->title = ($event->role == "super_admin" ? "Super Admin" : "Admin") . ': ' . $event->title;
            return $event;
        });

        if ($request->expectsJson()) {
            return response()->json($data);
        }
        return Inertia::render('Admin/Calendar', $data);
    }

    public function store(Request $request)
    {
        try {
            $newEvent = new CalendarEvent([
                'title' => $request->title,
                'start' => $request->start,
                'end' => $request->end,
                'user_id' => $request->user_id,
            ]);

            $newEvent->save();

            if ($request->expectsJson()) {
                $user = User::find($request->user_id);
                UserEventsHistory::create([
                    'user_name' => $user->name(),
                    'event_name' => 'Create Calendar Event',
                    'campus_name' => $user->campus?->name,
                    'office_name' => $user->designation?->name,
                    'description' => 'created a calendar event with title ' . $request->title
                ]);



                $users = User::whereHasRole(['unit_head', 'admin'])->get();
                Notification::sendNow($users, new NewCalendarEvent($newEvent));

                return response()->json(['event' => $newEvent]);
            }

            // UserEventsHistory::create([
            //     'user_name' => $request->user()->name(),
            //     'event_name' => 'Create Calendar Event',
            //     'campus_name' => $request->user()->campus?->name,
            //     'office_name' => $request->user()->designation?->name,
            //     'description' => 'created a calendar event with title ' . $request->title
            // ]);

            return redirect()->back()->with('success', 'Successfully created!');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Request $request)
    {
        $event = CalendarEvent::find($request->id);

        $event->delete();

        $user = User::find($event->user_id);

        UserEventsHistory::create([
            'user_name' => $user->name(),
            'event_name' => 'Delete Calendar Event',
            'campus_name' => $user->campus?->name,
            'office_name' => $user->designation?->name,
            'description' => 'delete a calendar event with title ' . $event->title
        ]);

        return response()->json(['success' => true]);
    }

    public function destroyAll(Request $request)
    {
        CalendarEvent::truncate();

        $user = User::find($request->user_id);

        UserEventsHistory::create([
            'user_name' => $user->name(),
            'event_name' => 'Delete Calendar Event',
            'campus_name' => $user->campus?->name,
            'office_name' => $user->designation?->name,
            'description' => 'deleted all calendar events'
        ]);

        return response()->json(['success' => true]);
    }
}
