<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classification extends Model
{
    use HasFactory;
    protected $classification = [
        'name'
    ];


    public function designations(){
        return $this->hasMany(Designation::class,'classification_id','id');
    }
}
