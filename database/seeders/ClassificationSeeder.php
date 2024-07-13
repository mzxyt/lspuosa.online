<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $rows = [
            [
                'classification' => 'Student Welfare Service',
                'designations' => [
                    'Guidance and Counseling / Admission and Testing Services',
                    'Information and Orientation Service',
                    'Alumni and Job Placement Services',
                    'Student Handbook Development',
                ]
            ],
            [
                'classification' => 'Institutional Student Program and Services',
                'designations' => [
                    'Student Organization Activities',
                    'Leadership Training Programs',
                    'Student Council Student Discipline',
                    'Student Publication',
                    'Student Council / Government'
                ]
            ],
            [
                'classification' => 'Student Development Services',
                'designations' => [

                    'Scholarship and Financial Assistance',
                    'Economic Enterprise Development',
                    'Food Services',
                    'Health Services / University Nurse',
                    'Safety and Security',
                    'Student Housing & Residential Services',
                    'Mult-faith',
                    'International Student Service',
                    'Support for Student with Special Needs and Person with Disabilities',
                    'Socio-Cultural Program',
                    'Sports',
                    'Community Involvement',
                    'Research Monitoring and Evaluation Student'
                ]
            ]
        ];

        foreach ($rows as $key => $row) {
            $classification_id = DB::table('classifications')->insert([
                'name' => $row['classification']
            ]);

            foreach ($row['designations'] as $designation) {
                DB::table('designations')->insert([
                    'classification_id' => $classification_id,
                    'name' => $designation
                ]);
            }
        }
    }
}
