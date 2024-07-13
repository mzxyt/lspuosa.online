<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserEventsHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_name',
        'event_name',
        'campus_name',
        'office_name',
        'description',
    ];
}
