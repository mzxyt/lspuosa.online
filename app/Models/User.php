<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laratrust\Contracts\LaratrustUser;
use Laratrust\Traits\HasRolesAndPermissions;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements LaratrustUser
{
    use HasApiTokens, HasFactory, Notifiable, HasRolesAndPermissions;

    /*
        load relationships
    */
    protected $with = ['campus', 'designation', 'userRoles'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'email',
        'phone',
        'password',
        'designation_id',
        'campus_id',
        'employee_no',
        'image',
        'google_access_token',
        'is_deleted',
        'has_read_policy'
    ];


    public function name(): string
    {
        return $this->firstname . ' ' . $this->lastname;
    }
    /* Relations */
    public function feedbacks(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }
    public function designation()
    {
        return $this->belongsTo(Designation::class, 'designation_id', 'id')->with(['classification']);
    }
    public function campus()
    {
        return $this->belongsTo(Campus::class, 'campus_id', 'id');
    }

    public function userRoles()
    {
        return $this->roles();
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    /**
     * The channels the user receives notification broadcasts on.
     */
    public function receivesBroadcastNotificationsOn(): string
    {
        return 'users.' . $this->id;
    }


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
