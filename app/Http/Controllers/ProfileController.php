<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use App\Models\UserEventsHistory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rules;


class ProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Profile');
    }

    public function update(Request $request)
    {
        $user = User::find($request->user()->id);
        if ($user) {
            $user->image = $request->image;
            $user->firstname = $request->firstname;
            $user->lastname = $request->lastname;
            $user->middlename = $request->middlename;
            $user->phone = $request->phone;
            if ($user->hasRole('super_admin')) {
                $user->email = $request->email;
            }

            $user->save();

            UserEventsHistory::create([
                'user_name' => $request->user()->name(),
                'event_name' => 'Update Profile',
                'campus_name' => $request->user()->campus?->name,
                'office_name' => $request->user()->designation?->name,
                'description' => 'updated profile'
            ]);

            return redirect()->intended(route('profile.edit'))->with('success', 'Successfully saved changes!');
        }

        return redirect()->intended(route('profile.edit'))->with('error', 'Something please try again later!');
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        $user = User::find($request->user()->id);
        if ($user) {
            $hashed = Hash::make($request->password);
            $user->password = $hashed;
            $user->save();

            UserEventsHistory::create([
                'user_name' => $request->user()->name(),
                'event_name' => 'Change Password',
                'campus_name' => $request->user()->campus?->name,
                'office_name' => $request->user()->designation?->name,
                'description' => 'changed password'
            ]);

            return redirect()->intended(route('profile.edit'))->with('success', 'Successfully saved changes!');
        }

        return redirect()->intended(route('profile.edit'))->with('error', 'Something please try again later!');
    }
}
