<?php

use App\Events\NewCommentAdded;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AnnualReportController;
use App\Http\Controllers\AppSettingsController;
use App\Http\Controllers\CalendarEventController;
use App\Http\Controllers\CampusAdminController;
use App\Http\Controllers\CampusController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ObjectiveController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\ReportAttachmentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SubmissionBinController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\UnitHeadController;
use App\Http\Controllers\UsersController;
use App\Mail\CalendarEventMail;
use App\Mail\NewReportMail;
use App\Models\AnnualReport;
use App\Models\CalendarEvent;
use App\Models\Classification;
use App\Models\Designation;
use App\Models\Report;
use App\Models\ReportComment;
use App\Models\SubmissionBin;
use App\Models\User;
use App\Models\UserCheckoutEntry;
use App\Models\UserEventsHistory;
use App\Models\UserObjective;
use App\Notifications\CalendarEventNotification;
use App\Notifications\DueSubmissionBin;
use App\Notifications\NewComment;
use App\Notifications\NewReportApproved;
use App\Notifications\NewReportSubmitted;
use App\Notifications\NewSubmissionBin;
use App\Notifications\ReportStatusUpdated;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::post('/broadcasting-auth', function () {
    return true;
});

Route::get('/', function () {
    $hasAdmin = count(User::whereHasRole(['super_admin'])->get()) > 0;
    if (!$hasAdmin) {
        // if no admin redirect to register
        return redirect()->intended(route('admin.register'));
    }
    return Inertia::render('Welcome');
})->middleware(['guest'])->name('welcome');

// super admin
Route::prefix('/admin')->group(function () {
    // Route::get('/', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/register', [AdminController::class, 'register'])->name('admin.register')->middleware('guest');
    Route::post('/create', [AdminController::class, 'create'])->name('admin.create')->middleware('guest');
});

// 

Route::prefix('/admin')->middleware(['auth:web'])->group(function () {
    Route::get('/reminders', [AdminController::class, 'reminders'])->name('admin.reminders');
    Route::get('/generated-reports-annually', [
        AnnualReportController::class,
        function () {
            return Inertia::render('Admin/AnnualReports');
        }
    ])->name('admin.generated-reports');
    Route::get('/generated-reports-annually/{id}', [
        AnnualReportController::class,
        function () {
            return Inertia::render('Admin/SpecificAnnualReport');
        }
    ])->name('admin.generated-reports.specific');
    Route::get('/calendar', [CalendarEventController::class, 'index'])->name('calendar')->middleware(['auth']);
    Route::get('/objectives', [ObjectiveController::class, 'index'])->name('admin.objectives');
    Route::put('/objectives/{id}', [ObjectiveController::class, 'update'])->name('admin.objectives.update');

    Route::get('/objectives/{id}/edit', [ObjectiveController::class, 'edit'])->name('admin.objectives.edit');

    // userobjectives monitoring
    Route::get('/user-objectives', function () {
        // get designations
        $designations = Classification::with(['designations'])->get();
        return Inertia::render(
            'Admin/ObjectiveMonitoring',
            [
                'classifications' => $designations
            ]
        );
    })->name('admin.user_objectives');

    // userobjectives archives
    Route::get('/user-objectives/archives', function () {
        return Inertia::render('Admin/ObjectiveMonitoringArchive');
    })->name('admin.user_objectives.archives');

    Route::get('/generate', [AnnualReportController::class, 'getSpecificReports'])->name('admin.annual_reports.create');

    // members
    Route::get('/members', [AdminController::class, 'members'])->name('admin.members');

    // userobjectives entries
    Route::get('/objectives/{id}/entries', function ($id) {

        // get all user objective entries
        $userObjective = UserObjective::where('id', $id)->orderBy('created_at', 'desc')->get();

        // get all user objective entries
        // $userObjectiveEntries = UserCheckoutEntry::where('objective_id', $id)->orderBy('created_at', 'desc')->get(); // error
        $userObjectiveEntries = UserCheckoutEntry::whereHas('objectiveEntry', function ($query) use ($userObjective) {
            $query->where('objective_id', $userObjective[0]->objective_id);
        })->orderBy('created_at', 'desc')->get();

        // json decode info_data
        $userObjectiveEntries->map(function ($entry) {
            $entry->info_data = json_decode($entry->info_data);
            return $entry;
        });

        // get user
        $userObjectiveEntries->map(function ($entry) {
            $entry->user = User::find($entry->user_id);
            return $entry;
        });

        return Inertia::render('Admin/ObjectiveEntries', [
            'userObjectiveEntries' => $userObjectiveEntries,
        ]);
    })->name('admin.user_objectives.entries');

    Route::get('/objectives/create', [ObjectiveController::class, 'create'])->name('admin.objectives.create');
    Route::get('/signout', [AdminController::class, 'signout'])->name('admin.signout');
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/announcements', [AdminController::class, 'announcements'])->name('admin.announcements');
    Route::get('/announcements/create', [AdminController::class, 'create_announcement'])->name('admin.create_announcement')->middleware(['role:super_admin|admin']);
    Route::get('/announcements/{id}/edit', [AdminController::class, 'edit_announcement'])->name('admin.edit_announcement')->middleware(['role:super_admin|admin']);
    Route::get('/reminders/create', [AdminController::class, 'create_reminder'])->name('admin.create_reminder')->middleware(['role:super_admin|admin']);
    Route::get('/reminders/{id}/edit', [AdminController::class, 'edit_reminder'])->name('admin.edit_reminder')->middleware(['role:super_admin|admin']);
    Route::get('/unit-heads', [AdminController::class, 'unit_heads_profile'])->name('admin.unit_heads.profiles')->middleware(['role:super_admin|admin']);
    Route::get('/unit-heads/records', [AdminController::class, 'unit_heads_records'])->name('admin.unit_heads.records')->middleware(['role:super_admin|admin']);
    Route::get('/unit-heads/create', [AdminController::class, 'create_unit_head'])->name('admin.unit_heads.create')->middleware(['role:super_admin|admin']);
    Route::get('/unit-heads/{id}/edit', [AdminController::class, 'edit_unit_head'])->name('admin.unit_heads.edit')->middleware(['role:super_admin|admin']);
    Route::get('/campus-admins', [AdminController::class, 'admins'])->name('admin.admins')->middleware(['role:super_admin']);
    Route::get('/admins/create', [AdminController::class, 'createAdmin'])->name('admin.admins.create')->middleware(['role:super_admin|admin']);
    Route::get('/campus-admins/{id}/edit', [AdminController::class, 'editCampusAdmin'])->name('admin.campus_admin.edit')->middleware(['role:super_admin']);
    Route::get('/feedbacks', [AdminController::class, 'feedbacks'])->name('admin.feedbacks')->middleware(['role:super_admin|admin']);
    Route::get('/feedback', [UnitHeadController::class, 'feedback'])->name('unit_head.feedback')->middleware(['auth']);
    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings')->middleware(['role:super_admin']);
    Route::patch('/settings/{appSettings}', [AppSettingsController::class, 'update'])->name('settings.update')->middleware(['role:super_admin']);
    Route::prefix('/document-tracking')->group(function () {
        Route::get('/submission-bins', [AdminController::class, 'submission_bins'])->name('admin.submission_bins');
        Route::get('/submission-bins/{id}/details', [AdminController::class, 'viewSubmissionBin'])->name('admin.submission_bin.details');
        Route::get('/submission-bins/create', [AdminController::class, 'create_submission_bin'])->name('admin.create_submission_bin')->middleware(['role:super_admin']);
        Route::get('/submission-bins/{id}/edit', [AdminController::class, 'edit_submission_bin'])->name('admin.edit_submission_bin')->middleware(['role:super_admin']);
        Route::get('/reports/{submission_bin_id}/view', [AdminController::class, 'viewReports'])->name('admin.reports.view');
        Route::get('/reports/{campus_id}/{designation_id}/view/filtered', [AdminController::class, 'viewFilteredReports'])->name('admin.reports.view.filtered');
        Route::get('/reports/unit-head/{report_id}/view', [AdminController::class, 'viewReport'])->name('admin.report.open');
        Route::get('/reports/archive', [AdminController::class, 'archiveReports'])->name('admin.reports.archive');
        Route::get('/reports/for-review', [ReportController::class, 'forReview'])->name('admin.reports.for-review')->middleware('role:admin|super_admin');
        Route::get('/reports/{text}/search', [ReportController::class, 'search'])->name('admin.reports.for-review.search');
        Route::get('/reports/checklist', [ReportController::class, 'showChecklist'])->name('admin.reports.checklist')->middleware('role:admin|super_admin');
        Route::get('/reports/for-review/{campus}', [ReportController::class, 'campusForReview'])->name('admin.reports.for-review.campus')->middleware('role:admin|super_admin');
        Route::get('/reports/for-rejected', [ReportController::class, 'forRejected'])->name('admin.reports.for-rejected')->middleware('role:admin|super_admin');
    });
    // annual-reports
    Route::get('/annual-reports/{id}', [AnnualReportController::class, 'index'])->name('admin.annual_reports.specific');
    // user_events_history
    Route::get('/user-events', function () {
        // get all user events
        $userEvents = UserEventsHistory::orderBy('created_at', 'desc')->get();

        return Inertia::render('UserEventsHistory', [
            'userEvents' => $userEvents
        ]);
    })->name('admin.user_events_history');

    // user_events_history
    Route::get('/notifications-history', function (Request $request) {
        // get all user events
        $userNotifications = $request->user()->notifications()->get();

        return Inertia::render('NotificationsHistory', ['userNotifications' => $userNotifications]);
    })->name('admin.notifications_history')->middleware(['role:super_admin|admin|unit_head']);
});

Route::prefix('/notifications')->middleware(['auth'])->group(function () {
    Route::get('/{id}', [NotificationController::class, 'open'])->name('notifications.open');
});

Route::prefix('/unit-head')->middleware(['auth', 'role:super_admin|admin'])->group(function () {
    Route::post('/create', [UnitHeadController::class, 'create'])->name('unit_head.create');
    Route::delete('/{id}', [UnitHeadController::class, 'delete'])->name('unit_head.delete');
    Route::patch('/{id}', [UnitHeadController::class, 'edit'])->name('unit_head.edit');
    Route::get('/reports', [UnitHeadController::class, 'reports'])->name('unit_head.reports');
    // userobjectives archives

});



Route::prefix('/unit-head')->middleware(['auth', 'role:unit_head'])->group(function () {
    Route::get('/reports', [UnitHeadController::class, 'reports'])->name('unit_head.reports');
    Route::get('/reports/{id}/submission-bin', [UnitHeadController::class, 'submission_bin'])->name('unit_head.submission_bin');
    Route::get('/calendar', [UnitHeadController::class, 'calendar'])->name('unit_head.calendar');
    Route::get('/user-objectives/archives', function () {
        return Inertia::render('UnitHead/ObjectiveArchives');
    })->name('unit_head.objectives.archives');
});
Route::get('/announcements', [UnitHeadController::class, 'announcements'])->name('unit_head.announcements')->middleware(['role:admin|unit_head']);




Route::prefix('/submission-bins')->middleware(['auth', 'role:super_admin'])->group(function () {
    Route::post('/attach-files', [SubmissionBinController::class, 'attachFiles'])->name('submission_bins.attach-files');
    Route::post('/create', [SubmissionBinController::class, 'create'])->name('submission_bins.create');
    Route::delete('/{id}', [SubmissionBinController::class, 'delete'])->name('submission_bins.delete');
    Route::patch('/{id}', [SubmissionBinController::class, 'edit'])->name('submission_bins.update');
});

Route::prefix('/announcements')->middleware(['auth', 'role:super_admin|admin'])->group(function () {
    Route::post('/create', [AnnouncementController::class, 'create'])->name('announcements.create');
    Route::delete('/{id}', [AnnouncementController::class, 'delete'])->name('announcements.delete');
    Route::patch('/{id}', [AnnouncementController::class, 'edit'])->name('announcements.edit');
});

Route::prefix('/reports')->middleware(['auth'])->group(function () {
    Route::post('/{submission_bin_id}/submit', [ReportController::class, 'submitReport'])->name('reports.submit');
    Route::patch('/{submission_bin_id}/unsubmit', [ReportController::class, 'unSubmitReport'])->name('reports.unsubmit');
    Route::get('/{report}/view', [ReportController::class, 'view'])->name('reports.view');
    Route::get('/latest', [ReportController::class, 'latest'])->name('reports.latest');
    Route::get('/latest/{user_id}', [ReportController::class, 'campusLatest'])->name('reports.latest.campus');
    Route::patch('{id}/status/update', [ReportAttachmentController::class, 'updateStatus'])->name('reports.status.update');
});

Route::prefix('/objectives')->middleware(['auth'])->group(function () {
    // Route::post('/{submission_bin_id}/submit', [ReportController::class, 'submitReport'])->name('reports.submit');
    // Route::patch('/{submission_bin_id}/unsubmit', [ReportController::class, 'unSubmitReport'])->name('reports.unsubmit');
    // Route::get('/{report}/view', [ReportController::class, 'view'])->name('reports.view');
    Route::get('/latest', [UsersController::class, 'latestTarget'])->name('objectives.latest');
    // Route::get('/latest/{user_id}', [ReportController::class, 'campusLatest'])->name('reports.latest.campus');
    // Route::patch('{id}/status/update', [ReportAttachmentController::class, 'updateStatus'])->name('reports.status.update');
});

Route::prefix('/feedback')->middleware(['auth'])->group(function () {
    Route::post('/create', [FeedbackController::class, 'create'])->name('feedback.create');
});


Route::prefix('/reminders')->middleware(['auth', 'role:super_admin|admin'])->group(function () {
    Route::post('/create', [ReminderController::class, 'create'])->name('reminders.create');
    Route::delete('/{id}', [ReminderController::class, 'delete'])->name('reminders.delete');
    Route::patch('/{id}', [ReminderController::class, 'edit'])->name('reminders.edit');
});
Route::prefix('/campus-admin')->middleware(['auth', 'role:super_admin'])->group(function () {
    Route::post('/create', [CampusAdminController::class, 'create'])->name('campus_admin.create');
    Route::delete('/{id}', [ReminderController::class, 'delete'])->name('campus_admin.delete');
    Route::patch('/{id}', [CampusAdminController::class, 'edit'])->name('campus_admin.edit');
});

Route::get('/dashboard', function (Request $request) {
    if ($request->user()->hasRole('admin')) {
        return redirect(route('admin.dashboard'));
    } else if ($request->user()->hasRole('super_admin')) {
        return redirect(route('admin.dashboard'));
    }
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/password', [ProfileController::class, 'changePassword'])->name('profile.password.update');
});


Route::prefix('/users')->group(function () {
    Route::post('/login', [UsersController::class, 'login'])->name('users.login');
});

Route::prefix('/super-admin')->group(function () {
    Route::post('/register', [SuperAdminController::class, 'register'])->name('super_admin.register');
});


Route::get('/mailable', function () {
    // $bin = SubmissionBin::where('id', '>', 0)->first();
    $unitHead = User::where('id', '>', 0)->first();
    $admin = User::whereHasRole('super_admin')->first();
    $report = $unitHead->reports()->first();
    $event = CalendarEvent::where('id', '>', 0)->first();
    $comment = ReportComment::first();

    return (new NewComment($comment))
        ->toMail($admin);
});

Route::post('/policy/read', function (Request $request) {
    $request->session()->put('has_read_policy', true);
    // session(['has_read_policy' => true]);
    // return response()->json(['success' => true]);
    return redirect()->back()->with('success', 'Welcome to LSPU OSA');
});


Route::get('/{appKey}/db/migrate/fresh', function ($appKey) {
    if ($appKey == config('app.key')) {
        Artisan::call('migrate:fresh', ['--seed' => true, '--force' => true]);
        return "Successfully migrated";
    } else {
        return abort(404);
    }
});
Route::get('/{appKey}/db/migrate', function ($appKey) {
    if ($appKey == config('app.key')) {
        Artisan::call('migrate', ['--force' => true]);
        return "Successfully migrated";
    } else {
        return abort(404);
    }
});

// OPCRQuestions
Route::group(['prefix' => 'opcrquestion'], function () {
    Route::get('/', [App\Http\Controllers\QuestionsController::class, 'opcrindex'])->name('opcrquestion.index');
    Route::get('/create', [App\Http\Controllers\QuestionsController::class, 'opcrcreate'])->name('opcrquestion.create');
    Route::post('/', [App\Http\Controllers\QuestionsController::class, 'opcrstore'])->name('opcrquestion.store');
    Route::get('/{id}/edit', [App\Http\Controllers\QuestionsController::class, 'opcredit'])->name('opcrquestion.edit');
    Route::put('/{id}', [App\Http\Controllers\QuestionsController::class, 'opcrupdate'])->name('opcrquestion.update');
    Route::delete('/{id}', [App\Http\Controllers\QuestionsController::class, 'opcrdestroy'])->name('opcrquestion.destroy');

    // archives /archives
    Route::get('/archives', [App\Http\Controllers\QuestionsController::class, 'opcrarchives'])->name('opcrquestion.archives');

    // archive question
    Route::put('/{id}/archive', [App\Http\Controllers\QuestionsController::class, 'archive'])->name('opcrquestion.archive');

    // unarchive question
    Route::put('/{id}/unarchive', [App\Http\Controllers\QuestionsController::class, 'unarchive'])->name('opcrquestion.unarchive');
})->middleware(['auth', 'verified']);

// Opcr group 
Route::group(['prefix' => 'opcr'], function () {

    Route::get('/', [App\Http\Controllers\OPCRController::class, 'index'])->name('opcr.index');
    Route::get('/create', [App\Http\Controllers\OPCRController::class, 'create'])->name('opcr.create');
    Route::post('/', [App\Http\Controllers\OPCRController::class, 'store'])->name('opcr.store');
    Route::get('/{id}', [App\Http\Controllers\OPCRController::class, 'show'])->name('opcr.show');
    Route::get('/{id}/edit', [App\Http\Controllers\OPCRController::class, 'edit'])->name('opcr.edit');
    Route::put('/{id}', [App\Http\Controllers\OPCRController::class, 'update'])->name('opcr.update');
    Route::delete('/{id}', [App\Http\Controllers\OPCRController::class, 'destroy'])->name('opcr.destroy');

    // print
    Route::get('/{id}/print', [App\Http\Controllers\OPCRController::class, 'print'])->name('opcr.print');
})->middleware(['auth', 'verified']);



require __DIR__ . '/auth.php';
