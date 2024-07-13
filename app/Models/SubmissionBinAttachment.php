<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubmissionBinAttachment extends Model {
    use HasFactory;

    protected $fillable = [
        'uri',
        'name',
        'submission_bin_id',
    ];

    public function report() {
        return $this->belongsTo(SubmissionBin::class, 'submission_bin_id', 'id');
    }
}
