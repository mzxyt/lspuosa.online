<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Announcement;
use App\Models\CalendarEvent;
use App\Models\Reminder;
use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\SubmissionBin;
use App\Models\SubmissionBinAttachment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */

    public function run(): void
    {
        //    seed unit head classification and designation
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
            $classification_id = DB::table('classifications')->insertGetId([
                'name' => $row['classification']
            ]);

            foreach ($row['designations'] as $designation) {
                DB::table('designations')->insert([
                    'classification_id' => $classification_id,
                    'name' => $designation
                ]);
            }
        }

        $campuses = ['Siniloan', 'Sta. Cruz', 'Los Baños', 'San Pablo'];

        foreach ($campuses as $key => $campus) {
            DB::table('campuses')->insert([
                'name' => $campus
            ]);
        }

        $this->call([
            RolesAndPermission::class,
        ]);

        // // create 10 announcements
        // for ($i = 0; $i < 10; $i++) {
        //     $maxOrder = Announcement::all(['order'])->max(fn($row) => $row->order);
        //     $order = $maxOrder + 1;
        //     DB::table('announcements')->insert([
        //         'title' => 'Announcement ' . $i,
        //         'content' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //         'order' => $order
        //     ]);
        // }

        // $usercounter = 0;

        // // create 10 unit heads
        // for ($i = 0; $i < count($campuses); $i++) {

        //     //create unique phone number for each campus
        //     $phone = '09' . rand(100000000, 999999999) + $i + rand(0, 999);

        //     // create 10 unit heads for each campus with classification and designation
        //     foreach ($rows as $key => $row) {

        //         $classification_id = $key + 1;
        //         foreach ($row['designations'] as $designation) {
        //             $designation_id = DB::table('designations')->where('name', $designation)->first()->id;
        //             $user = User::create([
        //                 'firstname' => 'Unit ' . $usercounter,
        //                 'middlename' => '' . $usercounter,
        //                 'lastname' => 'Head ' . $usercounter,
        //                 'email' => 'unithead' . rand(9, 234) . $i . rand(0, 999) . $key . '@gmail.com',
        //                 'phone' => $phone . $usercounter,
        //                 'password' => bcrypt('password'),
        //                 'designation_id' => $designation_id,
        //                 'campus_id' => $i + 1,
        //             ]);
        //             $user->addRole('unit_head');
        //             $usercounter++;
        //         }
        //     }
        // }

        // // create 10 admins
        // for ($i = 0; $i < 10; $i++) {
        //     $admin = User::create([
        //         'firstname' => 'Admin ' . $i,
        //         'middlename' => '' . $i,
        //         'lastname' => 'Admin ' . $i,
        //         'email' => 'admin' . $i . '@gmail.com',
        //         'phone' => '09' . rand(100000000, 999999999) + $i + rand(0, 999),
        //         'password' => bcrypt('password'),
        //     ]);
        //     $admin->addRole('admin');
        // }

        // for ($i = 0; $i < 10; $i++) {

        //     $user = User::find(1);

        //     // create 10 calendar events with random start and end dates within january 2024
        //     $start = now()->addDays(rand(0, 365));
        //     $end = $start->addDays(rand(0, 365));

        //     CalendarEvent::create([
        //         'title' => 'Event ' . $i,
        //         'user_id' => $user->id,
        //         'start' => $start,
        //         'end' => $end,
        //         'type' => 'event',
        //         'notified' => false
        //     ]);
        // }

        // // create 10 reminders
        // for ($i = 0; $i < 10; $i++) {

        //     Reminder::create([
        //         'title' => 'Reminder ' . $i,
        //         'content' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',

        //     ]);
        // }

        // create settings

        // policy
        $policy = "<p><strong>Section 1</strong></p><p><br></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio eu feugiat pretium nibh ipsum. Condimentum lacinia quis vel eros donec ac. Tempus egestas sed sed risus pretium quam. Aenean vel elit scelerisque mauris pellentesque. Ac ut consequat semper viverra. Molestie at elementum eu facilisis sed odio. Mi ipsum faucibus vitae aliquet nec. Morbi tincidunt augue interdum velit. Vitae et leo duis ut. Sit amet nisl suscipit adipiscing bibendum. Scelerisque varius morbi enim nunc faucibus. Auctor urna nunc id cursus metus aliquam eleifend mi in. Viverra tellus in hac habitasse. Ultrices sagittis orci a scelerisque.</p><p><br></p><p><strong>Section 2</strong></p><p><br></p><p>Duis ultricies lacus sed turpis tincidunt id. Enim nulla aliquet porttitor lacus. Senectus et netus et malesuada fames ac turpis egestas integer. Egestas sed tempus urna et pharetra pharetra massa massa. Venenatis cras sed felis eget. Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque habitant. Diam donec adipiscing tristique risus nec feugiat. Sed id semper risus in hendrerit gravida rutrum. Sed vulputate odio ut enim. Quis auctor elit sed vulputate mi sit amet. Viverra maecenas accumsan lacus vel facilisis. Orci eu lobortis elementum nibh tellus molestie nunc. Integer enim neque volutpat ac tincidunt. Proin sagittis nisl rhoncus mattis rhoncus urna neque. Volutpat lacus laoreet non curabitur gravida arcu. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo vel.</p><p><br></p><p><strong>Section 3</strong></p><p><br></p><p>Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Diam quis enim lobortis scelerisque fermentum dui. Ut sem viverra aliquet eget sit amet tellus cras. Aliquam faucibus purus in massa tempor nec. At imperdiet dui accumsan sit. Aliquam id diam maecenas ultricies mi eget. Dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in. Vitae turpis massa sed elementum. Rhoncus mattis rhoncus urna neque viverra. Aliquet eget sit amet tellus cras adipiscing enim. Nisl pretium fusce id velit ut tortor.</p><p>Hendrerit gravida rutrum quisque non tellus. Non curabitur gravida arcu ac tortor dignissim convallis aenean et. At lectus urna duis convallis convallis. Aliquet enim tortor at auctor urna nunc. Arcu dui vivamus arcu felis bibendum. Felis eget nunc lobortis mattis aliquam faucibus. Sed cras ornare arcu dui vivamus arcu felis bibendum. Fermentum odio eu feugiat pretium. Nec nam aliquam sem et. Suspendisse interdum consectetur libero id faucibus nisl.</p>";
        DB::table('app_settings')->insert([
            'logo' => '/images/logo.png',
            'policy' => $policy
        ]);
    }
}
