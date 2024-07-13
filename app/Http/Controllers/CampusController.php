<?php

namespace App\Http\Controllers;

use App\Models\CalendarEvent;
use App\Models\Campus;
use Illuminate\Http\Request;

class CampusController extends Controller
{
    public function all(){
        $data['campuses'] = Campus::with(['unitHeads'])->get();

        return response()->json($data);
    }

    
}
