<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserEventsHistory;
use App\Notifications\NewCampusAdminNotif;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CampusAdminController extends Controller
{
    //

    public function create(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'campus_id' => 'required',
            'email' => 'required|email|unique:users,email|regex:/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/',
        ], [
            'email.regex' => 'This email is not a google account.'
        ]);

        $campus_admin = User::create([
            'email' => $request->email,
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'campus_id' => $request->campus_id,
        ]);

        $campus_admin->addRole('admin');

        $campus_admin->notify(new NewCampusAdminNotif($campus_admin));

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Create Campus Admin',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'created campus admin ' . $campus_admin->name()
        ]);

        return redirect()->intended(route('admin.admins'))->with('success', 'Successfully added!');
    }

    public function edit(Request $request)
    {
        $id = $request->user()->id;
        $request->validate([
            'email' => ['required', 'string', 'regex:/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/', Rule::unique('users', 'email')->ignore($request->id)],
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'campus_id' => 'required',
        ], [
            'email.regex' => 'This email is not a google account.'
        ]);

        $campus_admin = User::find($request->id);

        $campus_admin->email = $request->email;
        $campus_admin->firstname = $request->firstname;
        $campus_admin->lastname = $request->lastname;
        $campus_admin->middlename = $request->middlename;
        $campus_admin->campus_id = $request->campus_id;

        $campus_admin->save();

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Edit Campus Admin',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'edited campus admin ' . $campus_admin->name()
        ]);

        return redirect()->intended(route('admin.admins'))->with('success', 'Successfully saved changes!');
    }
}
