<?php

namespace App\Console\Commands;

use App\Models\Report;
use App\Models\SubmissionBin;
use App\Models\User;
use App\Notifications\DueSubmissionBin;
use Illuminate\Console\Command;

class DueSubmissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:due-submissions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $bins = SubmissionBin::whereRaw('DATE(deadline_date) = CURDATE()')->get();
        $unitHeads = User::whereHasRole('unit_head')->get();
        foreach ($bins as $key => $bin) {
            foreach($unitHeads as $unitHead){
                $reports = Report::where('submission_bin_id',$bin->id)->where('user_id',$unitHead->id)->where('status','!=','Rejected')->where('is_submitted',true)->get();
                if(count($reports)){
                    $unitHead->notify(new DueSubmissionBin($bin));
                }
            }
        }
    }
}
