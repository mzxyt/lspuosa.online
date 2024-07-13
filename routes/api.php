<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AnnualReportController;
use App\Http\Controllers\Api\ClassificationController;
use App\Http\Controllers\AppSettingsController;
use App\Http\Controllers\CalendarEventController;
use App\Http\Controllers\CampusController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ObjectiveController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\ReportCommentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SubmissionBinController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\UnitHeadController;
use App\Http\Controllers\UsersController;
use App\Models\SubmissionBin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/objective-documentation/{filename}', [ObjectiveController::class, 'downloadObjectiveDocumentation'])->name('objectives.documentation.download');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('/users')->group(function () {
    // Route::post('/check', [ProfileController::class, 'checkEmailAndPhone']);
    Route::post('/check', [UsersController::class, 'check'])->name('users.check');
});

Route::prefix('/classifications')->group(function () {
    Route::get('/all', [ClassificationController::class, 'getAll'])->name('api.classifications.all');
});

// get user count which is only created within this day which will be labled as : new users count
Route::get('/users/new', [UsersController::class, 'newUsersCount'])->name('users.new.count');

Route::get('/users/new/campus/{campus_id}', [UsersController::class, 'campusOnlyNewUsersCount'])->name('campus.users.new.count');

// get user count for those who is labeled as is_deleted which will be labled as : left users count
Route::get('/users/left', [UsersController::class, 'leftUsersCount'])->name('users.left.count');

// get all user count but only those who is not labeled as is_deleted which will be labled as : total users count
Route::get('/users/total', [UsersController::class, 'totalUsersCount'])->name('users.total.count');

Route::get('/users/total/campus/{campus_id}', [UsersController::class, 'campusOnlyTotalUsersCount'])->name('campus.users.total.count');

// get all users created within this day
Route::get('/users/today', [UsersController::class, 'newUsers'])->name('users.new');

// get all users who is labeled as is_deleted
Route::get('/users/deleted', [UsersController::class, 'leftUsers'])->name('users.left');

// total number of users submitted
Route::get('/users/submitted', [UsersController::class, 'submittedUsersCount'])->name('users.submitted.count');

// users has not been yet submitting, & near due date
Route::get('/users/due', [UsersController::class, 'dueUsersCount'])->name('users.due.count');

// users that has reached the due date
Route::get('/users/overdue', [UsersController::class, 'overdueUsersCount'])->name('users.overdue.count');

// deactivate user
Route::patch('/users/deactivate/{id}', [UsersController::class, 'deactivate'])->name('users.deactivate');

// activate user
Route::patch('/users/activate/{id}', [UsersController::class, 'activate'])->name('users.activate');

Route::post('/image-upload', function (Request $request) {
    $image = $request->file('image');
    $imageName = $image->getClientOriginalName();
    $image->move(public_path('images'), $imageName);
    $imageUrl = "/images/" . $imageName;

    return response()->json(['imageUrl' => $imageUrl]);
})->name('image.upload');

Route::post('/file-upload', function (Request $request) {
    $file = $request->file('file');
    $fileName = $file->getClientOriginalName();
    $file->move(public_path('reports'), $fileName);
    $fileUrl = "/reports/" . $fileName;

    return response()->json(['fileUrl' => $fileUrl]);
});

Route::post('/upload-report', [ReportController::class, 'addReport'])->name('report.upload');
Route::delete('/report/{id}/attachment', [ReportController::class, 'removeAttachment'])->name('report.attachment.delete');
Route::delete('/submission_bin/{id}/attachment', [SubmissionBinController::class, 'removeAttachment'])->name('submission_bin.attachment.delete');

Route::delete('/reminders/{id}', [ReminderController::class, 'delete'])->name('reminder.delete');
Route::get('/reminders/latest', [ReminderController::class, 'getLatest'])->name('reminder.latest');
Route::delete('/announcements/{id}', [AnnouncementController::class, 'delete'])->name('announcements.delete');
Route::patch('/announcements/order', [AnnouncementController::class, 'order']);
Route::get('/announcements', [AnnouncementController::class, 'getAll'])->name('announcements.index');
Route::get('/announcements/latest', [AnnouncementController::class, 'getLatest'])->name('announcements.latest');
Route::get('/announcements/dashboard', [AnnouncementController::class, 'dashboard'])->name('announcements.dashboard');
Route::post('/unit-heads/designations', [AdminController::class, 'unit_heads_by_designation'])->name('unit_heads.designations');
Route::get('/admins', [AdminController::class, 'getAdmins'])->name('admins');
Route::get('/admins/{campus_id}', [AdminController::class, 'getAdminsByCampus']);


Route::prefix('/reports')->group(function () {
    Route::get('/{campus_id}/{submission_bin_id}/{unit_head_id}/all', [ReportController::class, 'all'])->name('reports.all.index');
    Route::get('/{campus_id}/{submission_bin_id}/{unit_head_id}/approved', [ReportController::class, 'getApproved'])->name('reports.approved.index');
    Route::get('/{campus_id}/{designation_id}/unit_heads', [ReportController::class, 'unit_heads'])->name('reports.designation.unit_heads.index');
    Route::get('/{campus_id}/unit_heads/{designation_id}', [ReportController::class, 'unit_heads_designated']);
    Route::get('/{campus_id}/unit_heads', [ReportController::class, 'unit_heads_campus'])->name('reports.unit_heads.index');
    Route::get('/all/per-campus', [ReportController::class, 'getReportsPerCampus'])->name('reports.per_campus.index');
});

Route::prefix('/report')->group(function () {
    Route::patch('/{report_id}/reject', [ReportController::class, 'rejectReport'])->name('report.action.reject');
    Route::patch('/{report_id}/approve', [ReportController::class, 'approveReport'])->name('report.action.approve');
});

Route::prefix('/comments')->group(function () {
    Route::post('/add', [ReportCommentController::class, 'add'])->name('comments.add');
    Route::get('/{unit_head_id}/{submission_bin_id}/get', [ReportCommentController::class, 'get'])->name('comments.unit_head.sub_bin_id.index');
});

Route::prefix('/campus')->group(function () {
    Route::get('/', [CampusController::class, 'all'])->name('campus.index');
    Route::post('/', [CampusController::class, 'store'])->name('campus.store');
})->middleware(['auth']);

Route::prefix('/submissionBins')->group(function () {
    Route::get('/latest', [SubmissionBinController::class, 'getLatest'])->name('submission-bins.latest');
    Route::get('/{id}', [SubmissionBinController::class, 'all'])->name('submission-bins.index');
    Route::get('/{text}/search', [SubmissionBinController::class, 'search'])->name('submission-bins.search');
    Route::delete('/{id}', [SubmissionBinController::class, 'delete'])->name('submission-bins.delete');
    // get submission bins that are not yet closed

})->middleware(['auth']);

Route::get("/bins/not-closed", function () {
    $open = SubmissionBin::where('deadline_date', '>', now())->get();
    return response()->json($open);
})->name('submission-bins.not-closed');

Route::prefix('/objectives')->group(function () {
    // post objective

    Route::post('/', [ObjectiveController::class, 'storeObjective'])->name('objectives.store');
    Route::delete('/{id}', [ObjectiveController::class, 'delete'])->name('admin.objectives.delete');
    // get all objectives
    Route::get('/all', [ObjectiveController::class, 'all'])->name('objectives.all');

    // get all user objectives from UserObjective model
    Route::get('/{id}/all', [ObjectiveController::class, 'allUserObjectives'])->name('objectives.user.all');
    Route::put('/user', [ObjectiveController::class, 'updateUserObjective'])->name('objectives.user.update');

    // update user objective
    Route::put('/update', [ObjectiveController::class, 'updateObjective'])->name('objectives.update');

    // get all users objectives from UserObjective model
    Route::get('/all/user', [ObjectiveController::class, 'getUsersObjective'])->name('objectives.user.get');
    Route::get('/all/user/archived', [ObjectiveController::class, 'getUsersArchivedObjective'])->name('objectives.user.archive.get');
    Route::get('/all/user/indiv/archived', [ObjectiveController::class, 'getIndivUserArchivedObjective'])->name('objectives.user.archive.indiv.get');
    // get specific user objectives from UserObjective model that is archived
    Route::get('/{id}/archived', [ObjectiveController::class, 'getArchivedUserObjective'])->name('objectives.user.archived');

    // archive user objective
    Route::put('/archive', [ObjectiveController::class, 'archiveUserObjective'])->name('objectives.user.archive');

    // reject
    Route::put('/reject', [ObjectiveController::class, 'rejectObjective'])->name('objectives.reject');

    // approve
    Route::put('/approve', [ObjectiveController::class, 'approveObjective'])->name('objectives.approve');
})->middleware(['auth']);




Route::prefix('/calendar')->group(function () {
    Route::get('/', [CalendarEventController::class, 'index'])->name('calendar.index');
    Route::post('/', [CalendarEventController::class, 'store'])->name('calendar.store');
    Route::delete('/{id}', [CalendarEventController::class, 'destroy'])->name('calendar.destroy');
    Route::delete('/all/{user_id}', [CalendarEventController::class, 'destroyAll'])->name('calendar.destroy.all');
})->middleware(['auth']);

Route::prefix('/notifications')->group(function () {
    Route::get('/{id}', [NotificationController::class, 'get']);
    Route::get('/general/{user}', [NotificationController::class, 'general'])->name('notifications.general');
    Route::get('/calendar/{user}', [NotificationController::class, 'calendar'])->name('notifications.calendar');
    Route::patch('/read/{user}', [NotificationController::class, 'markAsRead'])->name('notifications.read.general');
    Route::patch('/read/calendar/{user}', [NotificationController::class, 'markAsReadCalendar'])->name('notifications.read.calendar');
})->middleware(['auth']);

Route::prefix('/unit_heads')->group(function () {
    Route::post('/delete/many', [UnitHeadController::class, 'deleteMany'])->name('unit_heads.delete.many');
})->middleware(['auth']);

Route::prefix('/admins')->group(function () {
    Route::post('/delete/many', [AdminController::class, 'deleteMany'])->name('admins.delete.many');
})->middleware(['auth', 'role:super_admin']);

Route::prefix('/super_admin')->group(function () {
    Route::delete('/super_admin/{user_id}/reset', [SuperAdminController::class, 'destroy'])->name('super_admin.destroy');
})->middleware(['auth', 'role:super_admin']);

Route::prefix('/reminders')->group(function () {
    Route::get('/', [ReminderController::class, 'all']);
})->middleware(['auth']);

// report data : {campus1 : {total: 0, offices : {office1 : 1, office2 : 2}}}}}}}
Route::get('/reports/summary', [ReportController::class, 'summary'])->name('reports.summary.index');
Route::get('/reports/summary/{user_id}', [ReportController::class, 'campusSummary'])->name('reports.summary.campus');
Route::put('/reports/unit-head/{report_id}/archive', [AdminController::class, 'archive'])->name('admin.report.archive');

// api/admin/annual-reports
Route::prefix('/admin/annual-reports')->group(function () {
    Route::get('/', [AnnualReportController::class, 'getAllAnnualReports'])->name('admin.annual_reports.index');
    Route::get('/{id}', [AnnualReportController::class, 'getAnnualReport'])->name('admin.annual_reports.show');

    // get specific annual report
    Route::post('/generate', [AnnualReportController::class, 'getSpecificReports'])->name('admin.annual_reports.generate');
    Route::delete('/{id}', [AnnualReportController::class, 'deleteAnnualReport'])->name('admin.annual_reports.delete');
});

Route::get('/policy', [AppSettingsController::class, 'getPolicy'])->name('policy');

// Route::post('/policy/read', function (Request $request) {
//     $request->session()->put('has_read_policy', true);
//     return redirect()->back();
// })->name('policy.read');

Route::group(['middleware' => ['web']], function () {
    Route::post('/policy/read', function (Request $request) {
        $user = User::find(auth()->user()->id);
        $user->has_read_policy = true;
        $user->save();

        $request->session()->put('has_read_policy', true);
        return redirect()->back();
    })->name('policy.read');
});
