<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\User;
use App\Models\UserEventsHistory;
use App\Notifications\NewAnnouncement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    //
    public function delete(Request $request)
    {
        $announcement = Announcement::where('id', $request->id)->firstOrFail();
        $announcement->delete();

        // create event history
        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Delete Announcement',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'Deleted announcement titled ' . "$announcement->title"
        ]);

        return response()->json(['message' => 'Successfully deleted!']);
    }

    public function create(Request $request)
    {

        // check if has announcements
        $count = Announcement::all(['id'])->count();
        $order = 0;

        if ($count > 0) {
            // get maximum order value
            $maxOrder = Announcement::all(['order'])->max(fn ($row) => $row->order);
            $order = $maxOrder + 1;
        }


        $announcement = Announcement::create([
            'title' => $request->title,
            'content' => $request->content,
            'images' => json_encode($request->images),
            'order' => $order
        ]);

        // create event history
        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Create Announcement',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'created announcement with title: ' . $request->title
        ]);

        $users = User::whereHasRole(['admin', 'unit_head'])->get();
        Notification::send($users, new NewAnnouncement($announcement));

        return redirect()->intended(route('admin.announcements'))->with('success', "Successfully added new accouncement!");
    }

    public function edit(Request $request)
    {
        $announcement = Announcement::find($request->id);

        $announcement->title = $request->title;
        $announcement->content = $request->content;
        $announcement->image = $request->image;

        $announcement->save();

        // create event history
        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Update Announcement',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'updated announcement titled ' . $request->title
        ]);

        return redirect()->intended(route('admin.announcements'))->with('success', "Successfully updated accouncement!");
    }
    public function order(Request $request)
    {
        $id_1 = $request->get('item_1');
        $id_2 = $request->get('item_2');

        $row_1 = Announcement::find($id_1);
        $row_2 = Announcement::find($id_2);
        $temp_order = $row_1->order;
        $row_1->order = $row_2->order;
        $row_2->order = $temp_order;

        $row_1->save();
        $row_2->save();

        return response()->json(['success' => true, 'rows' => [$row_1, $row_2]]);
    }

    /* API */
    public function getAll()
    {
        $data['announcements'] = Announcement::all();
        return response()->json($data);
    }

    /* API */
    public function dashboard()
    {
        $data['announcements'] = Announcement::orderByDesc('order')->limit(2)->get();
        return response()->json($data);
    }

    /* API */
    public function getLatest()
    {
        $data['latestAnnouncement'] = Announcement::latest('created_at')->first();
        return response()->json($data);
    }
}
