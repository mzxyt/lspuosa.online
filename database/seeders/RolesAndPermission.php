<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesAndPermission extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /* Roles */
        $admin = Role::create([
            'name' => 'admin',
            'display_name' => 'Admin',
        ]);

        $super_admin = Role::create([
            'name' => 'super_admin',
            'display_name' => 'Super Admin',
        ]);

        $unit_head = Role::create([
            'name' => 'unit_head',
            'display_name' => 'Unit Head',
        ]);

        /* Permissions */
        $manage_announcement = Permission::create([
            'name'=>'manage-announcement',
        ]);
        $manage_reminder = Permission::create([
            'name'=>'manage-reminder',
        ]);
        $create_admin = Permission::create([
            'name'=>'create-admin',
        ]);
        $create_report = Permission::create([
            'name'=>'create-report'
        ]);

        /* Permission assignment */
        $super_admin->givePermission($create_admin);
        $super_admin->givePermission($manage_announcement);
        $super_admin->givePermission($manage_reminder);

        $unit_head->givePermission($create_report);
    }
}
