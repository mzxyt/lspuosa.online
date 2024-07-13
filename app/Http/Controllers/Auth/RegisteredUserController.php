<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Classification;
use App\Models\SuperAdmin;
use App\Models\UnitHead;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $designations = Classification::with(['designations'])->get();
        return Inertia::render('Auth/Register', ['classifications' => $designations]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $model = $request->get('type') == 'super_admin' ? SuperAdmin::class : ($request->get('type') == 'admin' ? Admin::class : UnitHead::class);
        // dd($request->all(), $model, $request->get('type'));

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . $model,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $userData = [
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'designation_id' => $request->classificationIndex,
            'campus_id' => $request->campusIndex,
            'password' => Hash::make($request->password),
        ];

        $userType = $request->get('type');
        $home = '';

        switch ($userType) {
            case 'super_admin':
                $user = SuperAdmin::create($userData);
                $home = route('super-admin.index');
                break;
            case 'admin':
                $user = Admin::create($userData);
                break;
            case 'unit_head':
                // $user = UnitHead::create($userData);
                // create user
                $user = User::create($userData);
                $user->addRole('unit_head');
                break;
        }

        event(new Registered($user));

        Auth::guard($userType)->login($user);

        return redirect($home);
    }
}
