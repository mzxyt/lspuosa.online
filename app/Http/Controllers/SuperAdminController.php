<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SuperAdminController extends Controller
{
    public function destroy(Request $request)
    {
        $super_admin = User::find($request->user_id);
        $super_admin->delete();

        return response()->json(['success' => true]);
    }

    public function register(Request $request)
    {
        if (User::whereHasRole('super_admin')->first()) {
            return redirect()->route('admin.register')->with('failed', 'There is already a super admin');
        } else {
            $user = User::create([
                'firstname' => $request->firstname,
                'middlename' => $request->middlename,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'phone' => $request->phone,
                'google_access_token' => $request->access_token,
                'image' => $request->image,
            ]);

            if ($user) {
                $user->addRole('super_admin');
                Auth::login($user, true);
                return redirect()->intended(route('admin.dashboard'));
            }

            return redirect()->back()->with('error', 'Error');
        }
    }
}
