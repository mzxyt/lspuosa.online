<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('users.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('comments.{submission_bin_id}.{unit_head_id}', function (User $user, int $submission_bin_id, int $unit_head_id) {
    // return $user->hasRole('unit_head') ? ($user->id === $unit_head_id) : true;
    return true;
});
