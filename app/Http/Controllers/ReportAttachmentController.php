<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\User;
use App\Models\UserEventsHistory;
use App\Notifications\NewReportApproved;
use App\Notifications\ReportStatusUpdated;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportAttachmentController extends Controller
{
    //

    public function view($id)
    {
        $data['file'] = ReportAttachment::with(['report'])->find($id);
        return Inertia::render('ViewFile', $data);
    }

    public function updateStatus(Request $request)
    {
        $report = Report::with(['submission_bin', 'unitHead'])->find($request->id);
        $report->status = $request->status;
        $success = $report->save();



        if ($request->status === 'Approved') {
            $super_admins = User::whereHasRole('super_admin')->get();
            foreach ($super_admins as $key => $super_admin) {
                $super_admin->notify(new NewReportApproved($report));
            }

            UserEventsHistory::create([
                'user_name' => $request->user()->name(),
                'event_name' => 'Approve Report',
                'campus_name' => $request->user()->campus?->name,
                'office_name' => $request->user()->designation?->name,
                'description' => 'approved report with title ' . "$report->title"
            ]);
        }
        if ($success) {
            $unitHead = User::find($report->user_id);
            $unitHead->notify(new ReportStatusUpdated($report, $request->user()));

            UserEventsHistory::create([
                'user_name' => $request->user()->name(),
                'event_name' => 'Update Report Status',
                'campus_name' => $request->user()->campus?->name,
                'office_name' => $request->user()->designation?->name,
                'description' => 'updated report status with title ' . "$report->title"
            ]);

            return redirect()->back()->with('success', 'Successfully updated status!');
        }

        return redirect()->back()->with('error', 'Something went wrong please try again later!');
    }
}
