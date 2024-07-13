<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Objective extends Model
{
    use HasFactory;

    protected $with = ['entries'];

    protected $fillable = [
        'title',
        'objective_type', // 0 - manual, 1 - submission || , 2 - fixed # will not be accessible
        'submission_bin_id',
        'designation_id',
    ];

    public function entries()
    {
        return $this->hasMany(ObjectiveEntry::class);
    }

    //    designation
    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    public function classification()
    {
        return $this->belongsTo(Classification::class);
    }

    public function userObjectives()
    {
        return $this->hasMany(UserObjective::class);
    }

    public function submissionBin()
    {
        return $this->belongsTo(SubmissionBin::class);
    }
}
