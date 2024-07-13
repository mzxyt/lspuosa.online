<?php

namespace App\Http\Controllers;

use App\Models\AnnualReport;
use App\Models\Campus;
use App\Models\User;
use App\Models\UserEventsHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnualReportController extends Controller
{
    public function index($id)
    {
        $report = AnnualReport::find($id);

        $report->data = json_decode($report->data);

        // convert data to array
        $report->data = (array) $report->data;

        return Inertia::render(
            'Admin/SpecificAnnualReport',
            [
                'report' => $report,
            ]
        );
    }

    public function generateReport(Request $request)
    {
        try {
            // Get report data
            $data = [];
            $year = $request['data']['year'];
            $user = User::find($request['data']['user']);

            // Get all campuses
            $campuses = Campus::all();

            // Loop through each campus
            foreach ($campuses as $campus) {
                $data[$campus->name] = [
                    'total' => 0,
                    'quarters' => [
                        '1Q' => ['total' => 0, 'offices' => [], 'reports' => []],
                        '2Q' => ['total' => 0, 'offices' => [], 'reports' => []],
                        '3Q' => ['total' => 0, 'offices' => [], 'reports' => []],
                        '4Q' => ['total' => 0, 'offices' => [], 'reports' => []],
                    ]
                ];

                // Get all users in the campus
                $users = User::where('campus_id', $campus->id)->get();

                // Loop through each user
                foreach ($users as $user) {
                    // Loop through each user's reports
                    foreach ($user->reports as $report) {
                        // Check if report's year matches the requested year
                        if ($report->created_at->format('Y') != $year) {
                            continue;
                        }

                        // Calculate quarter based on report's creation month
                        $quarter = ceil($report->created_at->format('m') / 3);

                        // Increment total reports for the quarter
                        $data[$campus->name]['quarters'][$quarter . 'Q']['total']++;

                        // Increment total reports for the campus
                        $data[$campus->name]['total']++;

                        // Add the report to the corresponding quarter
                        $data[$campus->name]['quarters'][$quarter . 'Q']['reports'][] = [
                            'id' => $report->id,
                            'status' => $report->status,
                            'remarks' => $report->remarks,
                            'date_submitted' => $report->date_submitted,
                            'unit_head' => $user,
                            'is_submitted' => $report->is_submitted,
                            'is_archived' => $report->is_archived,

                            'created_at' => $report->created_at,
                            'updated_at' => $report->updated_at,
                            'submission_bin_id' => $report->submission_bin_id,
                            'entries' => $report->entries,
                            'attachments' => $report->attachments,
                            'timely_matter' => $this->checkTimeliness($report),
                        ];

                        // Add the report to the corresponding office count
                        if ($user->designation) {
                            $officeName = $user->designation->name;
                            $data[$campus->name]['quarters'][$quarter . 'Q']['offices'][$officeName] =
                                ($data[$campus->name]['quarters'][$quarter . 'Q']['offices'][$officeName] ?? 0) + 1;
                        }
                    }
                }
            }

            // Save the generated report and log the event
            AnnualReport::create([
                'generated_by' => $user->firstname . ' ' . $user->lastname,
                'generated_at' => now(),
                'data' => json_encode($data),
            ]);

            UserEventsHistory::create([
                'user_name' => $user->name(),
                'event_name' => 'Generate Annual Report',
                'campus_name' => $user->campus?->name,
                'office_name' => $user->designation?->name,
                'description' => 'Generated annual report for year ' . $year . '.',
            ]);

            return response()->json(['message' => 'Report generated successfully!', 'data' => $data]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function getSpecificReports(Request $request)
    {
        try {
            // Get report data
            $data = [];
            $year = $request['year'];
            $campusId = $request['campus'];
            $quarter = $request['quarter'];
            $user = User::find($request['user']);

            // Get the specified campus
            $campus = Campus::find($campusId);

            // Initialize data for the specified campus
            $data[$campus->name] = [
                'total' => 0,
                'quarters' => [
                    $quarter . 'Q' => ['total' => 0, 'offices' => [], 'reports' => []],
                ]
            ];

            // Get all users in the specified campus
            $users = User::where('campus_id', $campusId)->get();

            // Loop through each user
            foreach ($users as $user) {
                // Loop through each user's reports
                foreach ($user->reports as $report) {
                    // Check if report's year matches the requested year
                    if ($report->created_at->format('Y') != $year) {
                        continue;
                    }

                    // Calculate quarter based on report's creation month
                    $reportQuarter = ceil($report->created_at->format('m') / 3);

                    // Check if report's quarter matches the requested quarter
                    if ($reportQuarter != $quarter) {
                        continue;
                    }

                    // Increment total reports for the specified quarter
                    $data[$campus->name]['quarters'][$quarter . 'Q']['total']++;

                    // Increment total reports for the specified campus
                    $data[$campus->name]['total']++;

                    // Add the report to the corresponding quarter
                    $data[$campus->name]['quarters'][$quarter . 'Q']['reports'][] = [
                        'id' => $report->id,
                        'status' => $report->status,
                        'remarks' => $report->remarks,
                        'date_submitted' => $report->date_submitted,
                        'unit_head' => $user,
                        'is_submitted' => $report->is_submitted,
                        'is_archived' => $report->is_archived,
                        'created_at' => $report->created_at,
                        'quarter' => $reportQuarter,
                        'updated_at' => $report->updated_at,
                        'submission_bin_id' => $report->submission_bin_id,
                        'entries' => $report->entries,
                        'attachments' => $report->attachments,
                        'timely_matter' => $this->checkTimeliness($report),
                    ];

                    // Add the report to the corresponding office count
                    if ($user->designation) {
                        $officeName = $user->designation->name;
                        $data[$campus->name]['quarters'][$quarter . 'Q']['offices'][$officeName] =
                            ($data[$campus->name]['quarters'][$quarter . 'Q']['offices'][$officeName] ?? 0) + 1;
                    }
                }
            }

            return response()->json(['message' => 'Report generated successfully!', 'data' => json_decode(json_encode($data))]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }


    // Helper function to check the timeliness of a report submission
    private function checkTimeliness($report)
    {
        $submissionBin = $report->submission_bin;
        $deadline = $submissionBin->deadline_date . ' ' . $submissionBin->deadline_time;
        $dateSubmitted = $report->date_submitted;

        return strtotime($dateSubmitted) <= strtotime($deadline) ? 'On-time' : 'Late';
    }





    // get all reports
    public function getAllAnnualReports()
    {
        try {
            $reports = AnnualReport::all();

            return response()->json(['reports' => $reports]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Reports not found!']);
        }
    }

    // delete report
    public function deleteAnnualReport(Request $request, $id)
    {
        try {

            $report = AnnualReport::find($id);
            $report->delete();

            UserEventsHistory::create([
                'user_name' => $request->user()->name(),
                'event_name' => 'Delete Annual Report',
                'campus_name' => $request->user()->campus?->name,
                'office_name' => $request->user()->designation?->name,
                'description' => 'Deleted annual report for year ' . $report->data->year . '.',
            ]);

            return response()->json(['message' => 'Report deleted successfully!']);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Report not found!']);
        }
    }
}
