<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportEntry extends Model
{
    use HasFactory;


    protected $fillable = [
        'report_id',
        'title',
        'date',
        'duration',
        'participants',
        'budget',
        'conducted_by',
        'location',
        'documentation',
        'event_name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class)->with(['submission_bin']);
    }
}
