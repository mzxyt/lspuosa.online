<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class qeta extends Model
{
    use HasFactory;

    protected $fillable = [
        'mfa_type',
        'q',
        'e',
        't',
        'a',
        'opcr_id',
        'question_id',
        'actual_accomplishments',
        'alloted_budgets',
    ];

    // get question
    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
