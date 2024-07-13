<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opcr extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'comments',
        'from',
        'to',
    ];



    // User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // qeta
    public function qeta()
    {
        return $this->hasMany(qeta::class);
    }
}
