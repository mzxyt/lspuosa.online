<?php

namespace App\Models;

use App\Notifications\NewSubmissionBin;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubmissionBin extends Model
{
    use HasFactory;
    protected $with = ['reports', 'attachments', 'unsubmitted_reports'];

    protected $fillable = [
        'status',
        'title',
        'instruction',
        'deadline_date',
        'deadline_time',
        'has_deadline',
        'campus_id',
        'designation_id',
    ];

    public function attachments(): HasMany
    {
        return $this->hasMany(SubmissionBinAttachment::class, 'submission_bin_id', 'id')->orderByDesc('id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'submission_bin_id', 'id')->where('is_submitted', true);
    }

    public function unsubmitted_reports(): HasMany
    {
        return $this->hasMany(Report::class, 'submission_bin_id', 'id')->where('is_submitted', false);
    }

    public function approved_reports(): HasMany
    {
        return $this->hasMany(Report::class, 'submission_bin_id', 'id')->where('is_submitted', true)->where('status', 'Approved');
    }
}
