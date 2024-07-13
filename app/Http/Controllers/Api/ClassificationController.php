<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campus;
use App\Models\Classification;
use Illuminate\Http\Request;

class ClassificationController extends Controller
{
    /* 
     * Get all classifcation with designartions
     */
    public function getAll()
    {
        $data['classifications'] = Classification::with(['designations'])->get();
        $data['campuses'] = Campus::all();
        
        return response()->json($data);
    }
}
