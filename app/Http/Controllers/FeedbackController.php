<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\UserEventsHistory;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    //

    public function create(Request $request)
    {
        $feedback = Feedback::create([
            'reaction' => $request->reaction,
            'type' => $request->type,
            'comment' => $request->comment,
            'user_id' => $request->user()->id,
        ]);

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Create Feedback',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'wrote a feedback ' . $feedback->comment
        ]);

        return redirect()->back()->with('success', 'Successfully submitted your feedback, Thank you for giving your time!');
    }
}
