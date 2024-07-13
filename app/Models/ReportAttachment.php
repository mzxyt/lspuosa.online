<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'uri',
        'name',
        'report_id',
    ];

    public function report(){
        return $this->belongsTo(Report::class,'report_id','id');
    }
}
