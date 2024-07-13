<?php

namespace App\Http\Controllers;

use App\Mail\NewUnitHeadMail;
use App\Models\Announcement;
use App\Models\CalendarEvent;
use App\Models\Report;
use App\Models\SubmissionBin;
use App\Models\User;
use App\Models\UserEventsHistory;
use App\Notifications\NewUnitHeadNotif;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UnitHeadController extends Controller
{
    //
    public function create(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'campus_id' => 'required',
            'designation_id' => 'required',
            'password' => 'required|string|min:8',
        ]);



        $user = User::create([
            'email' => $request->email,
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'campus_id' => $request->campus_id,
            'password' => bcrypt('password'), // default password is 'password
            'designation_id' => $request->designation_id,
        ]);


        $user->addRole('unit_head');

        $user->notify(new NewUnitHeadNotif($user));

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Create Unit Head',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'created unit head ' . $user->name()
        ]);

        return redirect()->intended(route("admin.unit_heads.records"))->with('success', 'Successfully added!');
    }

    public function edit(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', Rule::unique('users', 'email')->ignore($request->id)],
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'campus_id' => 'required',
            'designation_id' => 'required',

        ], [
            'email.regex' => 'This email is not a google account.'
        ]);

        $unitHead = User::find($request->id);

        if ($request->password) {
            $request->validate([
                'password' => 'required|string|min:8',
            ]);
            $unitHead->password = bcrypt($request->password);
        }

        $unitHead->email = $request->email;
        $unitHead->firstname = $request->firstname;
        $unitHead->lastname = $request->lastname;
        $unitHead->middlename = $request->middlename;
        $unitHead->campus_id = $request->campus_id;
        $unitHead->designation_id = $request->designation_id;


        $unitHead->save();

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Edit Unit Head',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'edited unit head ' . $unitHead->name()
        ]);

        return redirect()->intended(route('admin.unit_heads.records'))->with('success', 'Successfully saved changes!');
    }

    /* reports page*/
    public function reports(Request $request)
    {
        // check if submission bin has designation set but if not lets not add it to check 

        $data['submissionBins'] = SubmissionBin::where('campus_id', $request->user()->campus_id)
            ->limit(5)
            ->orderByDesc('id')
            ->get();

        $data['rows'] = count(SubmissionBin::all());
        $data['reports'] = $request->user()->reports()->get();

        $data['submissionBins'] = $data['submissionBins']->filter(function ($submissionBin) use ($request) {
            if ($submissionBin->designation_id == null) {
                return $submissionBin;
            } else {
                return $submissionBin->designation_id == $request->user()->designation_id;
            }
        });


        return Inertia::render('UnitHead/UnitHeadReports', $data);
    }

    public function submission_bin(Request $request, $id)
    {
        $submissionBin = SubmissionBin::where('id', $id)->with(['attachments'])->firstOrFail();
        $data['submissionBin'] = $submissionBin;
        $data['report'] = Report::with(['attachments', 'entries'])->where('submission_bin_id', $submissionBin->id)->where('user_id', $request->user()->id)->first();

        return Inertia::render('UnitHead/SubmissionBin', $data);
    }

    public function feedback()
    {
        return Inertia::render('UnitHead/UnitHeadFeedback');
    }

    public function announcements()
    {
        $data['announcements'] = Announcement::all();
        return Inertia::render('UnitHead/Announcements', $data);
    }
    public function deleteMany(Request $request)
    {
        $ids = $request->id;
        $user = User::find($request->user_id);

        foreach ($ids as $id) {
            User::find($id)->delete();
        }

        UserEventsHistory::create([
            'user_name' => $user->name(),
            'event_name' => 'Delete Unit Heads',
            'campus_name' => $user->campus?->name,
            'office_name' => $user->designation?->name,
            'description' => 'deleted unit head/s'
        ]);

        return Inertia::render('Admin/UnitHeadRecord');
    }
    public function calendar(Request $request)
    {
        $data['events'] = CalendarEvent::all();
        // event must have user data get it using user_id
        $data['events'] = $data['events']->map(function ($event) {
            $event->role = User::find($event->user_id)->roles->first()->name;
            // add user role to title for example "Unit Head: Meeting"
            $event->title = ($event->role == "super_admin" ? "Super Admin" : "Admin") . ': ' . $event->title;
            return $event;
        });



        // dd events user role
        // dd($data['events']);
        if ($request->expectsJson()) {
            return response()->json($data);
        }
        return Inertia::render('UnitHead/Calendar', $data);
    }
}
