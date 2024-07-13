<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObjectiveEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'objective_id',
        'description',
        'title'
    ];

    public function Objective()
    {
        return $this->belongsTo(Objective::class);
    }
}
