<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CalendarEvent extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'user_id',
        'start',
        'end',
        'type',
        'notified'
    ];

    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }
}
