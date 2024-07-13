<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campus extends Model
{
    use HasFactory;
    protected $fillable = [
        'name'
    ];

    public function unitHeads() : HasMany
    {
        return $this->hasMany(User::class,'campus_id','id')->whereHasRole('unit_head');
    }
}
