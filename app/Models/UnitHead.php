<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;


class UnitHead extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $auth_route = "/unit-head";
    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'email',
        'phone',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
