<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Report extends Model
{
    use HasFactory;

    protected $with = ['unitHead', 'attachments', 'entries'];

    protected $fillable = [
        'user_id',
        'submission_bin_id',
        'status',
        'is_resubmitted',
        'is_archived',
        'is_submitted',
        'date'
    ];

    public function attachments(): HasMany
    {
        return $this->hasMany(ReportAttachment::class, 'report_id', 'id')->orderByDesc('id');
    }

    public function unitHead(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function comments()
    {
        return $this->hasMany(ReportComment::class, 'report_id', 'id');
    }

    public function entries()
    {
        return $this->hasMany(ReportEntry::class, 'report_id', 'id');
    }

    public function campus()
    {
        return $this->belongsTo(Campus::class, 'report_campus_id', $this->unitHead()->campus->id);
    }

    public function submission_bin(): BelongsTo
    {
        return $this->belongsTo(SubmissionBin::class, 'submission_bin_id', 'id');
    }
}
