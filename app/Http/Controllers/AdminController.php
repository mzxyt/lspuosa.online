<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Announcement;
use App\Models\AppSettings;
use App\Models\Campus;
use App\Models\Classification;
use App\Models\Designation;
use App\Models\Feedback;
use App\Models\Reminder;
use App\Models\Report;
use App\Models\SubmissionBin;
use App\Models\SuperAdmin;
use App\Models\UnitHead;
use App\Models\User;
use App\Models\UserEventsHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;


class AdminController extends Controller
{
    public function index()
    {
        /*
            check if no admin account exists yet.
        */
        $hasAdmin = count(User::whereHasRole(['super_admin'])->get()) > 0;
        if (!$hasAdmin) {
            // if no admin redirect to register
            return redirect()->intended(route('admin.register'));
        }

        return Inertia::render('Admin/Auth/SignIn');
    }

    /* sign out user */
    public function signout()
    {
        auth()->logout();
        return redirect()->intended('/');
    }

    /*
        shows registration form
    */
    public function register()
    {
        return Inertia::render('Admin/Auth/Register');
    }

    public function create(Request $request)
    {
        $type = $request->get('type');

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);
        $user->addRole($type);

        // if($type == 'admin'){
        //     return redirect()->intended(route('admin.dashboard'));
        // }
        return redirect()->intended(route('admin.dashboard'));
    }

    /* admin panel pages */
    public function dashboard()
    {
        $data['campuses'] = Campus::with(['unitHeads'])->get();

        return Inertia::render('Dashboard', $data);
    }
    /*
        announcements page
    */
    public function announcements()
    {
        $data['announcements'] = Announcement::orderByDesc('id')->get();
        return Inertia::render('Admin/Announcements', $data);
    }

    public function create_announcement()
    {
        return Inertia::render('Admin/CreateAnnouncement');
    }
    public function edit_announcement(Request $request)
    {
        $data['announcement'] = Announcement::find($request->id);
        return Inertia::render('Admin/EditAnnouncement', $data);
    }

    /*
        reminders page
    */
    public function reminders()
    {
        $data['reminders'] = Reminder::all();
        return Inertia::render('Admin/Reminders', $data);
    }

    public function create_reminder()
    {
        return Inertia::render('Admin/CreateReminder');
    }
    public function edit_reminder($id)
    {
        $data['reminder'] = Reminder::find($id);
        return Inertia::render('Admin/EditReminder', $data);
    }

    /* Submission bin */
    public function submission_bins(Request $request)
    {
        if ($request->user()->hasRole('admin')) {
            $data['reports'] = Report::whereIn('user_id', User::select('id')->where('campus_id', $request->user()->campus_id))->where('is_submitted', true)->get();

            $data['submission_bins'] = SubmissionBin::limit(10)->orderByDesc('id')->get();
        } else {
            $data['submission_bins'] = SubmissionBin::with(['approved_reports'])->limit(5)->orderByDesc('id')->get();
        }

        $data['rows'] = count(SubmissionBin::all());

        return Inertia::render('Admin/SubmissionBins', $data);
    }

    public function create_submission_bin()
    {
        $data = [];
        $data['classifications'] = Classification::with(['designations'])->get();
        $data['campuses'] = Campus::all();

        return Inertia::render('Admin/CreateSubmissionBin', $data);
    }
    public function edit_submission_bin(Request $request)
    {
        $data['submissionBin'] = SubmissionBin::find($request->id);
        return Inertia::render('Admin/EditSubmissionBin', $data);
    }

    /* unit heads */
    public function unit_heads_profile(Request $request)
    {
        $data['campuses'] = Campus::all();
        $data['classifications'] = Classification::all();
        return Inertia::render('Admin/UnitHeads', $data);
    }

    /* api */
    public function unit_heads_by_designation(Request $request)
    {
        $designations = Designation::where('classification_id', $request->classification_id)->get();
        foreach ($designations as $key => $designation) {
            $designation['unit_heads'] = User::whereHasRole('unit_head')->where('campus_id', $request->campus_id)->where('designation_id', $designation->id)->get();
        }
        return response()->json(['designations' => $designations]);
    }

    public function create_unit_head(Request $request)
    {
        $data['classifications'] = Classification::with(['designations'])->get();
        $data['campuses'] = Campus::all();
        return Inertia::render('Admin/CreateUnitHead', $data);
    }
    public function edit_unit_head(Request $request)
    {
        $data['classifications'] = Classification::with(['designations'])->get();
        $data['unitHead'] = User::find($request->id);

        $data['unitHead']->designation;
        $data['unitHead']->designation->classification;
        return Inertia::render('Admin/EditUnitHead', $data);
    }

    public function unit_heads_records(Request $request)
    {
        if ($request->user()->hasRole('super_admin')) {
            $data['unitHeads'] = User::with(['campus', 'designation'])->whereHasRole('unit_head')->get();
        } else {
            $campus_id = $request->user()->campus_id;
            $data['unitHeads'] = User::with(['campus', 'designation'])->whereHasRole('unit_head')->where('campus_id', $campus_id)->get();
        }
        return Inertia::render('Admin/UnitHeadRecord', $data);
    }

    public function admins(Request $request)
    {
        $data['campus_admins'] = User::with(['campus'])->whereHasRole('admin')->orderBy('campus_id')->get();
        return Inertia::render('Admin/Admins', $data);
    }

    public function getAdmins(Request $request)
    {
        $data['admins'] = User::with(['campus'])->whereHasRole('admin')->orderBy('campus_id')->get();
        return response()->json($data);
    }
    public function getAdminByCampus(Request $request)
    {
        $data['admins'] = User::with(['campus'])->where('campus_id', $request->campus_id)->whereHasRole('admin')->groupBy('campus_id')->get();
        return response()->json($data);
    }

    public function createAdmin(Request $request)
    {
        $data['campuses'] = Campus::all();
        return Inertia::render('Admin/CreateAdmin', $data);
    }

    public function editCampusAdmin(Request $request)
    {
        $data['admin'] = User::where('id', $request->id)->whereHasRole('admin')->firstOrFail();
        $data['campuses'] = Campus::all();

        return Inertia::render('Admin/EditAdmin', $data);
    }

    public function viewReports(Request $request)
    {
        // $reports = SubmissionBin::whereIn('id',Report::select('id')->where('status','Approved'))->with(['reports'])->get();
        $data['submissionBin'] = SubmissionBin::find($request->submission_bin_id);
        $data['campuses'] = Campus::all();

        return Inertia::render('Admin/ViewReports', $data);
    }
    public function viewFilteredReports(Request $request)
    {
        $data['campus'] = Campus::find($request->campus_id);
        $data['designation'] = Designation::with(['classification'])->find($request->designation_id);
        $data['submissionBins'] = SubmissionBin::all();

        return Inertia::render('Admin/ViewFilteredReports', $data);
    }

    public function viewReport(Request $request)
    {
        // $reports = SubmissionBin::whereIn('id',Report::select('id')->where('status','Approved'))->with(['reports'])->get();
        $data['report'] = Report::with(['submission_bin', 'entries'])->where('id', $request->report_id)->firstOrFail();
        return Inertia::render('Admin/ViewReport', $data);
    }

    public function viewSubmissionBin(Request $request)
    {
        $data['submissionBin'] = SubmissionBin::find($request->id);
        return Inertia::render('Admin/SubmissionBin', $data);
    }
    public function feedbacks(Request $request)
    {
        $data['feedbacks'] = Feedback::with(['user'])->get();
        return Inertia::render('Admin/Feedbacks', $data);
    }

    public function settings()
    {
        $data['settings'] = AppSettings::first();
        return Inertia::render('Admin/Settings', $data);
    }

    public function deleteMany(Request $request)
    {
        $ids = $request->id;

        foreach ($ids as $key => $id) {
            $admin = User::where('id', $id)->whereHasRole(['admin'])->first();
            $admin->delete();
        }

        return response()->json(['success' => true]);
    }

    // members page
    public function members(Request $request)
    {

        return Inertia::render('Admin/Members');
    }

    // archive
    public function archive(Request $request, $report_id)
    {
        $report = Report::find($report_id);
        $report->is_archived = !$report->is_archived;
        $report->save();

        return response()->json(['success' => true]);
    }

    // archiveReports
    public function archiveReports(Request $request)
    {
        return Inertia::render('Admin/ArchivedReports');
    }
}
