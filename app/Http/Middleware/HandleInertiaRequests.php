<?php

namespace App\Http\Middleware;

use App\Models\AppSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Laratrust\Laratrust;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        try {
            return array_merge(parent::share($request), [
                'auth' => [
                    'user' => $request->user(),
                    'role' => $request->user() ? ($request->user()->hasRole('super_admin') ? 'super_admin' : ($request->user()->hasRole('admin') ? 'admin' : 'unit_head')) : null,
                ],
                'flash' => [
                    'message' => fn () => $request->session()->get('message'),
                    'success' => fn () => $request->session()->get('success'),
                    'failed' => fn () => $request->session()->get('failed'),
                ],
                'ziggy' => function () use ($request) {
                    return array_merge((new Ziggy)->toArray(), [
                        'location' => $request->url(),
                    ]);
                },
                'prevPage' => url()->previous(),
                'appLogo' => AppSettings::first()->logo,
                'hasReadPolicy' => fn () => $request->session()->get('has_read_policy', false)
            ]);
        } catch (\Throwable $th) {
            return array_merge(parent::share($request), []);
        }
    }
}
