<?php

namespace App\Http\Controllers;

use App\Events\NewCommentAdded;
use App\Models\ReportComment;
use App\Models\User;
use App\Models\UserEventsHistory;
use App\Notifications\NewComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportCommentController extends Controller
{
    /* API */
    public function get(Request $request)
    {
        $data['comments'] = ReportComment::where('submission_bin_id', $request->submission_bin_id)->where('unit_head_id', $request->unit_head_id)->get();
        return response()->json($data);
    }

    /* API */
    public function add(Request $request)
    {
        $user = User::where('id', $request->user_id)->first();

        $comment = ReportComment::create([
            'user_id' => $request->user_id,
            'unit_head_id' => $request->unit_head_id,
            'submission_bin_id' => $request->submission_bin_id,
            'comment' => $request->comment,
            'report_id' => $request->report_id,
            'is_removed' => false,
        ]);


        UserEventsHistory::create([
            'user_name' => $user->name(),
            'event_name' => 'Add Comment',
            'campus_name' => $user->campus?->name,
            'office_name' => $user->designation?->name,
            'description' => 'added comment ' . "$comment->comment"
        ]);

        // NewCommentAdded::dispatch($comment);
        event(new NewCommentAdded($comment));

        // $newComment = ReportComment::with(['report'])->where('id',$comment->id)->first();

        $user = User::find($request->user_id);
        $unitHead = User::find($request->unit_head_id);

        if ($user->hasRole('unit_head')) {
            $superAdmin = User::whereHasRole(['super_admin'])->first();
            $superAdmin->notify(new NewComment($comment));

            $campusAdmins = User::whereHasRole('admin')->where('campus_id', $unitHead->campus_id)->get();
            foreach ($campusAdmins as $key => $campusAdmin) {
                $campusAdmin->notify(new NewComment($comment));
            }
        } else if ($user->hasRole('super_admin')) {
            $campusAdmins = User::whereHasRole('admin')->where('campus_id', $unitHead->campus_id)->get();
            foreach ($campusAdmins as $key => $campusAdmin) {
                $campusAdmin->notify(new NewComment($comment));
            }
            $unitHead->notify(new NewComment($comment));
        } else {
            // if campus admin
            $campusAdmins = User::whereHasRole('admin')->where('campus_id', $unitHead->campus_id)->where('id', '!=', $user->id)->get();
            foreach ($campusAdmins as $key => $campusAdmin) {
                $campusAdmin->notify(new NewComment($comment));
            }
            $superAdmin = User::whereHasRole(['super_admin'])->first();
            $superAdmin->notify(new NewComment($comment));
            $unitHead->notify(new NewComment($comment));
        }

        return response()->json(['comment' => $comment]);
    }
}
