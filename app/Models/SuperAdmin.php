<?php

namespace App\Models;

use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;


class SuperAdmin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable,MustVerifyEmail;

    protected $auth_route = "/super-admin";

    protected $table='super_admins';
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
