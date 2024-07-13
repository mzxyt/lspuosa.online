<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCheckoutEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'objective_entry_id',
        'status',
        'completed_at',
        'user_id',
        'info_data',
        'file_path'
    ];

    public function objectiveEntry()
    {
        return $this->belongsTo(ObjectiveEntry::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
