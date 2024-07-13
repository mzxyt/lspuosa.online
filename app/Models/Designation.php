<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Designation extends Model
{
    use HasFactory;

    // protected $with = ['classification'];

    protected $fillable = [
        'classification_id',
        'name'
    ];

    public function classification()
    {
        return $this->belongsTo(Classification::class, 'classification_id', 'id');
    }
}
