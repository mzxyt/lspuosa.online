<?php

namespace App\Http\Controllers;

use App\Models\Campus;
use App\Models\Designation;
use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\ReportEntry;
use App\Models\SubmissionBin;
use App\Models\User;
use App\Models\UserEventsHistory;
use App\Models\UserObjective;
use App\Notifications\NewReportSubmitted;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;

class ReportController extends Controller
{
    /* API */
    public function all(Request $request)
    {
        $campus_id = $request->campus_id;
        $submission_bin_id = $request->submission_bin_id;
        $unit_heads = User::select('id')->where('campus_id', $campus_id);
        $data['reports'] = Report::with(['unitHead', 'entries'])->whereIn('user_id', $unit_heads)->where('submission_bin_id', $submission_bin_id)->where('user_id', $request->unit_head_id)->where('is_submitted', true)->get();

        return response()->json($data);
    }

    /* API */
    public function getApproved(Request $request)
    {
        $campus_id = $request->campus_id;
        $submission_bin_id = $request->submission_bin_id;
        $unit_heads = User::select('id')->where('campus_id', $campus_id);
        $data['reports'] = Report::whereIn('user_id', $unit_heads)->where('submission_bin_id', $submission_bin_id)->where('user_id', $request->unit_head_id)->where('is_submitted', true)->where('status', 'Approved')->get();

        return response()->json($data);
    }

    public function search(Request $request)
    {
        $searchText = $request->text;
        $data['searchText'] = $searchText;
        // ->where('name', 'like', '%' . $searchText . '%')->orWhere('designation', 'like', '%' . $searchText . '%')
        // $data['reports'] = Report::with(['unitHead'])->where('unit_head.name', 'like', '%' . $searchText . '%')->get();
        $data['reports'] = Report::whereHas('unitHead', function ($query) use ($request) {
            $query->where('firstname', 'like', "%{$request->text}%")->orWhere('lastname', 'like', "%{$request->text}%");
        })->get();

        return response()->json($data);
    }

    public function addReport(Request $request)
    {
        $bin_id = $request->submission_bin_id;
        $user = User::where('id', $request->user_id)->first();

        $report = Report::where('submission_bin_id', $bin_id)->where('user_id', $user->id)->first();
        // if no report created yet
        if (!$report) {
            // create report
            $report = Report::create([
                'user_id' => $user->id,
                'submission_bin_id' => $bin_id,
            ]);
        }
        // save report to server
        // $file = $request->file('file');
        // $fileName = $file->getClientOriginalName();
        // $file->move(public_path('reports'), $fileName);
        // $fileUrl = "/reports/" . $fileName;

        // create report attachment
        // $attachment = ReportAttachment::create([
        //     'uri' => $fileUrl,
        //     'name' => $fileName,
        //     'report_id' => $report->id
        // ]);


        UserEventsHistory::create([
            'user_name' => $user->name(),
            'event_name' => 'Add Report',
            'campus_name' => $user->campus?->name,
            'office_name' => $user->designation?->name,
            'description' => 'added a report '
        ]);

        return response()->json();
    }
    /* api */
    public function removeAttachment(Request $request)
    {
        $user = User::where('id', $request->user_id)->first();
        $attachment_id = $request->id;
        $attachment = ReportAttachment::find($attachment_id);
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

    public function submitReport(Request $request, SubmissionBin $submissionBin)
    {

        $user = $request->user();
        $report = null;

        /**
         * "report" => null
            "entries" => array:1 [▼
                0 => array:10 [▼
                "id" => "95d05ef4-0b61-418b-8caf-7355dad9886c"
                "title" => "asdasd"
                "event_name" => "asdasd"
                "date" => "2024-04-11"
                "documentation" => []
                "participants" => array:4 [▼
                    0 => array:2 [▼
                    "id" => "ac65c0a9-d6e9-40ae-8132-608a45305e7c"
                    "participant" => "asdasd"
                    ]
                    1 => array:2 [▶]
                    2 => array:2 [▶]
                    3 => array:2 [▶]
                ]
                "participants_number" => 0
                "location" => "test"
                "conducted_by" => "test"
                "budget" => true
                ]
         */

        if ($request->report) {
            $report = Report::find($request->report['id']);
            $report->is_resubmitted = true;
            $report->status = 'Resubmitted';
        } else {
            $report = Report::create([
                'user_id' => $user->id,
                'submission_bin_id' => $request->submission_bin_id,
                'is_resubmitted' => false
            ]);
            $report->status = 'Pending';
        }

        if ($report) {
            $report->is_submitted = true;
            $report->date_submitted = Carbon::now()->toDateTimeString();

            ReportEntry::where('report_id', $report->id)->delete();

            foreach ($request->entries as $entry) {
                $documentations = [];

                foreach ($entry['documentation'] as $image) {
                    if (gettype($image) === 'string') {
                        $documentations[] = $image;
                    } else {
                        $fileName = $image->getClientOriginalName();
                        $image->move(public_path('reports'), $fileName);
                        $fileUrl = "/reports/" . $fileName;
                        $documentations[] = $fileUrl;
                    }
                }

                ReportEntry::create([
                    'title' => $entry['title'],
                    'date' => $entry['date'],
                    'event_name' => $entry['event_name'],
                    'duration' => '',
                    'participants' => json_encode($entry['participants']),
                    'location' => $entry['location'],
                    'conducted_by' => $entry['conducted_by'],
                    'budget' => $entry['budget'],
                    'documentation' => json_encode($documentations),
                    'report_id' => $report->id
                ]);
            }

            //check if has deadline
            if ($report->deadline_date) {
                if ($report->deadline_date > Carbon::now()->toDate()) {
                    $report->remarks = "Submitted late";
                } else {
                    $report->remarks = "Submitted on time";
                }
            } else {
                $report->remarks = "Submitted on time";
            }

            if ($report->save()) {
                $admin = User::whereHasRole('admin')->where('campus_id', $user->campus_id)->get();
                foreach ($admin as $key => $admin) {
                    $admin->notify(new NewReportSubmitted($report));
                }

                UserEventsHistory::create([
                    'user_name' => $request->user()->name(),
                    'event_name' => 'Submit Report',
                    'campus_name' => $request->user()->campus?->name,
                    'office_name' => $request->user()->designation?->name,
                    'description' => 'submitted a report '
                ]);

                // get currentobjectives of user where submission_bin_id is $request->submission_bin_id
                // userObjective doesnt have submission_bin_id so we need to get the objectives of the user
                $objectives = UserObjective::where('user_id', $user->id)->whereHas('objective', function ($query) use ($request) {
                    $query->where('submission_bin_id', $request->submission_bin_id);
                })->get();

                // update is_completed to true
                foreach ($objectives as $objective) {
                    $objective->is_completed = true;
                    $objective->save();
                }

                return redirect()->back()->with("success", 'Successfully submitted!');
            }
        }

        return redirect()->back()->with('error', 'Something went wrong please try again later!');
    }
    public function unSubmitReport(Request $request)
    {
        $user = $request->user();
        $report = Report::where('submission_bin_id', $request->submission_bin_id)->where('user_id', $user->id)->first();

        if ($report) {
            $report->is_submitted = false;
            if ($report->save()) {
                UserEventsHistory::create([
                    'user_name' => $request->user()->name(),
                    'event_name' => 'Unsubmit Report',
                    'campus_name' => $request->user()->campus?->name,
                    'office_name' => $request->user()->designation?->name,
                    'description' => 'unsubmitted a report '
                ]);
                return redirect()->back();
            }
        }

        return redirect()->back()->with('error', 'Something went wrong please try again later!');
    }

    /* API */
    public function unit_heads(Request $request)
    {
        $unit_heads = User::where('campus_id', $request->campus_id)->where('designation_id', $request->designation_id)->whereHasRole(['unit_head'])->get();
        return response()->json(['unitHeads' => $unit_heads]);
    }

    public function unit_heads_designated(Request $request)
    {
        $unit_heads = User::where('campus_id', $request->campus_id)->whereHasRole(['unit_head'])->get();
        return response()->json(['unitHeads' => $unit_heads]);
    }

    public function unit_heads_campus(Request $request)
    {
        $unit_heads = User::where('campus_id', $request->campus_id)->whereHasRole(['unit_head'])->get();
        return response()->json(['unitHeads' => $unit_heads]);
    }

    public function view(Request $request, Report $report)
    {
        if ($request->user()->hasRole('unit_head')) {
            return redirect()->route('unit_head.submission_bin', ['id' => $report->submission_bin_id]);
        } else {
            return redirect()->route('admin.report.open', ['report_id' => $report->id]);
        }
    }

    public function latest(Request $request)
    {
        $latestReport = Report::latest('created_at')->first();
        return response()->json(['latestReport' => $latestReport]);
    }

    public function campusLatest(Request $request)
    {
        $user = User::find($request->user_id);
        $campus = Campus::find($user->campus_id);
        $latestReports = Report::latest('created_at')->get();

        foreach ($latestReports as $latestReport) {
            $latestReportUser = User::find($latestReport->user_id);
            $latestReportCampus = Campus::find($latestReportUser->campus_id);

            if ($latestReportCampus->name === $campus->name) {
                return response()->json(['latestReport' => $latestReport]);
            }
        }
    }

    public function forReview(Request $request)
    {
        $reports = Report::with(['unitHead', 'submission_bin', 'entries'])->get();
        $campus = Campus::all();
        $data = [
            'reports' => [],
            'entries' => [],
        ];

        if (auth()->user()->hasRole('super_admin')) {
            foreach ($reports as $report) {
                $reportCampus = Campus::get();

                array_push($data['reports'], $report);
                array_push($data['entries'], ...$report->entries);
            }
        } else {
            foreach ($reports as $report) {
                $reportUser = User::find($report->user_id);
                $reportCampus = Campus::find($reportUser->campus_id);

                if ($reportCampus->id === auth()->user()->campus_id) {
                    array_push($data['reports'], $report);
                    array_push($data['entries'], ...$report->entries);
                }
            }
        }

        // ddd($data);

        return Inertia::render('Admin/ForReviewReports', ['reports' => $data, 'campuses' => $campus]);
    }

    public function campusForReview(Request $request)
    {
        $data = [
            'campus' => [],
            'reports' => [],
            'entries' => [],
        ];
        $reports = Report::with(['unitHead', 'submission_bin', 'entries'])->where('is_archived', 0)->get();
        $data['campus'] = $request->campus;

        foreach ($reports as $report) {
            if ($report->unitHead->campus->name === $request->campus) {
                $data['reports'][] = $report;
                array_push($data['entries'], ...$report->entries);
            }
        }

        if (!isset($data['offices'])) {
            $data['offices'] = [];
        }

        return Inertia::render('Admin/CampusForReviewReports', $data);
    }

    public function forRequested(Request $request)
    {
        $reportsForRequested = Report::where('status', 'Approved')->get();
        return Inertia::render('Admin/ForRequestReports', [
            'reportsForRequested' => $reportsForRequested
        ]);
    }

    public function forRejected(Request $request)
    {
        $reportsForRejected = Report::where('status', 'Rejected')->with(['unitHead', 'submission_bin'])->get();
        return Inertia::render('Admin/ForRejectedReports', [
            'reportsForRejected' => $reportsForRejected
        ]);
    }

    public function getReportsPerCampus()
    {
        $reports = Report::all();
        $campus = Campus::all();
        return response()->json(['campuses' => $campus, 'reports' => $reports]);
    }

    public function summary(Request $request)
    {
        $campuses = Campus::all();

        foreach ($campuses as $key => $campus) {
            $data[$campus->name] = [
                'total' => 0,
                'offices' => []
            ];

            $reports = User::where('campus_id', $campus->id)->get();

            foreach ($reports as $key => $report) {
                $data[$campus->name]['total'] += $report->reports->count();

                // check if report has a designation
                if ($report->designation) {
                    // check if isset
                    if (isset($data[$campus->name]['offices'][$report->designation->name])) {
                        $data[$campus->name]['offices'][$report->designation->name] += $report->reports->count();
                    } else {
                        $data[$campus->name]['offices'][$report->designation->name] = $report->reports->count();
                    }
                }
            }
        }

        return response()->json(['data' => $data]);
    }

    public function campusSummary(Request $request)
    {
        $user = User::find($request->user_id);
        $campus = Campus::find($user->campus_id);
        $data = [
            'total' => 0,
            'offices' => []
        ];

        $reports = User::where('campus_id', $campus->id)->get();

        foreach ($reports as $key => $report) {
            $data['total'] += $report->reports->count();

            // check if report has a designation
            if ($report->designation) {
                // check if isset
                if (isset($data['offices'][$report->designation->name])) {
                    $data['offices'][$report->designation->name] += $report->reports->count();
                } else {
                    $data['offices'][$report->designation->name] = $report->reports->count();
                }
            }
        }

        return response()->json(['data' => $data]);
    }

    public function rejectReport(Request $request)
    {
        $report = Report::where('id', $request->report_id)->first();
        $user = User::where('id', $request->user_id)->first();

        $report->status = 'Rejected';
        if ($report->save()) {
            UserEventsHistory::create([
                'user_name' => $user->name(),
                'event_name' => 'Reject Report',
                'campus_name' => $user->campus?->name,
                'office_name' => $user->designation?->name,
                'description' => 'rejected a report '
            ]);
            return response()->json(["message" => 'Rejected report']);
        }
    }

    public function approveReport(Request $request)
    {
        $report = Report::where('id', $request->report_id)->first();
        $user = User::where('id', $request->user_id)->first();

        $report->status = 'Approved';
        if ($report->save()) {
            UserEventsHistory::create([
                'user_name' => $user->name(),
                'event_name' => 'Approve Report',
                'campus_name' => $user->campus?->name,
                'office_name' => $user->designation?->name,
                'description' => 'approved a report '
            ]);
            return response()->json(["message" => 'Approved report']);
        }
    }

    public function showChecklist(Request $request)
    {
        $data = [];
        $reports = Report::with(['unitHead', 'submission_bin'])->get();

        if (auth()->user()->hasRole('admin')) {
            foreach ($reports as $report) {
                if ($report->unitHead->campus->name === auth()->user()->campus->name) {
                    $data['offices'][$report->unitHead->designation->name][] = $report;
                }
            }
        } else {
            foreach ($reports as $report) {
                $data['offices'][$report->unitHead->designation->name][] = $report;
            }
        }

        if (!isset($data['offices'])) {
            $data['offices'] = [];
        }

        return Inertia::render('Admin/UnitHeadReportsChecklist', $data);
    }

    public function showCampusChecklist(Request $request)
    {
        $data = [];
        $reports = Report::with(['unitHead', 'submission_bin'])->get();
        foreach ($reports as $report) {
            if ($report->unitHead->campus->name === $request->campus_name) {
                $data['offices'][$report->unitHead->designation->name][] = $report;
            }
        }


        if (!isset($data['offices'])) {
            $data['offices'] = [];
        }

        return Inertia::render('Admin/UnitHeadReportsChecklist', $data);
    }
}
