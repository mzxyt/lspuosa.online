<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DesignationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('designations')->insert([
            [
                'classification_id' => 1,
                'name' => 'Guidance',
            ],
            [
                'classification_id' => 1,
                'name' => 'Information and Orientation Service',
            ],
            [
                'classification_id' => 1,
                'name' => 'Alumni and Job Fair Service',
            ],
            [
                'classification_id' => 1,
                'name' => 'Student Handbook Development',
            ],

        ]);
    }
}
