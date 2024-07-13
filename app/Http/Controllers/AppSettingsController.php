<?php

namespace App\Http\Controllers;

use App\Models\AppSettings;
use App\Models\User;
use App\Models\UserEventsHistory;
use Illuminate\Http\Request;

class AppSettingsController extends Controller
{
    //
    public function update(Request $request, AppSettings $appSettings)
    {
        $appSettings->logo = $request->logo;
        $appSettings->policy = $request->policy;
        if ($request->policy !== $appSettings->policy) {
            $unitHeads = User::all();

            foreach ($unitHeads as $unitHead) {
                $unitHead->has_read_policy = false;
                $unitHead->save();
            }
        }

        $appSettings->save();

        // UserEventsHistory
        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Update App Settings',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'Updated app settings'
        ]);

        return redirect()->back()->with('success', 'Successfully updated settings!');
    }

    public function getPolicy()
    {
        $appSettings = AppSettings::first();
        return response()->json(['policy' => $appSettings->policy]);
    }
}
