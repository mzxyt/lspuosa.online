<?php

namespace App\Http\Controllers;

use App\Events\SubmissionBinCreated;
use App\Mail\NewSubmissionBinNotif;
use App\Models\CalendarEvent;
use App\Models\Report;
use App\Models\SubmissionBin;
use App\Models\SubmissionBinAttachment;
use App\Models\User;
use App\Models\UserEventsHistory;
use App\Notifications\NewSubmissionBin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class SubmissionBinController extends Controller
{
    public function attachFiles(Request $request)
    {
        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $file->move(public_path('submission_bin_references'), $fileName);
        $fileUrl = "/submission_bin_references/" . $fileName;
        // create report attachment
        SubmissionBinAttachment::create([
            'uri' => $fileUrl,
            'name' => $fileName,
            'submission_bin_id' => $request->bin_id
        ]);

        return redirect()->intended(route('admin.submission_bins'))->with('success', 'Successfully created!');
    }

    //
    public function create(Request $request)
    {
        $bin = new SubmissionBin([
            'title' => $request->title,
            'instruction' => $request->instruction,
            'campus_id' => $request->campus_id,
            'designation_id' => $request->designation_id,
            'deadline_date' => $request->deadline_date,
            'deadline_time' => $request->deadline_time,
        ]);
        $bin->save();

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Create Submission Bin',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'created a submission bin named ' . "$bin->title"
        ]);

        if ($bin->deadline_date) {
            $calendarEvent = new CalendarEvent([
                'title' => $bin->title . ", deadline" . ($bin->deadline_time ? " @" . $bin->deadline_time : ''),
                'user_id' => $request->user()->id,
                'start' => $bin->deadline_date,
                'end' => $bin->deadline_date
            ]);
            $calendarEvent->save();
        }
        // SubmissionBinCreated::dispatch($bin);
        $users = User::whereHasRole(['admin', 'unit_head'])->get();
        foreach ($users as $key => $user) {
            $user->notify(new NewSubmissionBin($bin));
        }

        // $unitHeads = User::whereHasRole('unit_head')->get();
        // foreach ($unitHeads as $key => $unitHead) {
        //     $report = Report::create([
        //         'user_id' => $unitHead->id,
        //         'submission_bin_id' => $bin->id,
        //     ]);
        // }

        return response()->json(['bin' => $bin]);
    }

    public function removeAttachment(Request $request)
    {
        $user = User::where('id', $request->user_id)->first();
        $attachment_id = $request->id;
        $attachment = SubmissionBinAttachment::find($attachment_id);
        if ($attachment) {
            $attachment->delete();
        }

        UserEventsHistory::create([
            'user_name' => $user->name(),
            'event_name' => 'Remove Report Attachment',
            'campus_name' => $user->campus?->name,
            'office_name' => $user->designation?->name,
            'description' => 'removed report attachment '
        ]);

        return response()->json(['success' => true]);
    }

    public function edit(Request $request)
    {
        $submission_bin = SubmissionBin::find($request->id);
        $submission_bin->title = $request->title;
        $submission_bin->instruction = $request->instruction;
        $submission_bin->deadline_date = $request->deadline_date;
        $submission_bin->deadline_time = $request->deadline_time;
        $submission_bin->save();

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Edit Submission Bin',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'edited a submission bin named ' . "$submission_bin->title"
        ]);
        return redirect()->intended(route('admin.submission_bins'))->with('succes', 'Successfully saved changes!');
    }

    public function delete(Request $request)
    {
        $submission_bin = SubmissionBin::where('id', $request->id)->firstOrFail();
        $submission_bin->delete();

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Delete Submission Bin',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'deleted a submission bin named ' . "$submission_bin->title"
        ]);

        return redirect(route('admin.submission_bins'))->with('success', 'Successfully deleted!');
        // return response()->json(['success' => true]);
    }

    public function all(Request $request)
    {
        $lastId = $request->id;

        dd($request->user()->campus_id, $request->user()->designation_id);
        $data['submissionBins'] = SubmissionBin::where('campus_id', $request->user()->campus_id)
            ->where('designation_id', $request->user()->designation_id)
            ->where('id', '<', $lastId)
            ->limit(10)
            ->orderByDesc('id')
            ->get();

        $lastId = $data['submissionBins'][count($data['submissionBins']) - 1]->id;
        $data['hasRows'] = SubmissionBin::where('id', '<', $lastId)->count() > 0;
        return response()->json($data);

        // get all submission bins with pagination but only for the campus of the user and designation
        // $data['submissionBins'] = SubmissionBin::where('campus_id', $request->user()->campus_id)
    }

    public function search(Request $request)
    {
        $searchText = $request->text;
        $data['searchText'] = $searchText;
        $data['submissionBins'] = SubmissionBin::where('title', 'like', '%' . $searchText . '%')->get();
        return response()->json($data);
    }

    public function getLatest()
    {
        $data['latestSubmissionBin'] = SubmissionBin::latest()->first();
        return response()->json($data);
    }
}
