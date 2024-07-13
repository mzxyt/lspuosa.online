<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    // fillable
    protected $fillable = [
        'question_type',
        'isQRequired',
        'isERequired',
        'isTRequired',
        'target_indicators',
        'remarks',
        'efficiency',
        'supporting_documents',
        'individuals_accountable',
        'title',
        'user_id',
        'edited_at',
        'isArchived'
    ];

    // user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
