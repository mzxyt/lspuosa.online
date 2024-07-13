<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportComment extends Model
{
    use HasFactory;

    protected $with = ['user'];

    protected $fillable = [
        'user_id',
        'comment',
        'is_removed',
        'unit_head_id',
        'submission_bin_id',
        'report_id'
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
