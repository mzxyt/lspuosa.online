<?php

namespace App\Http\Controllers;

use App\Models\Classification;
use App\Models\Objective;
use App\Models\ObjectiveEntry;
use App\Models\User;
use App\Models\UserCheckoutEntry;
use App\Models\UserObjective;
use App\Notifications\NewTargetEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ObjectiveController extends Controller
{
    // index
    public function index()
    {
        return Inertia::render('Admin/Objectives');
    }

    // edit
    public function edit($id)
    {
        $objective = Objective::find($id);

        // Restructure the entries
        $restructuredEntries = $objective->entries->map(function ($entry) {
            return [
                'id' => $entry->id,
                'requirement' => $entry->description,
                'title' => $entry->title,
            ];
        });

        $data['classifications'] = Classification::with(['designations'])->get();



        return Inertia::render('Admin/EditObjective', [
            'objective' => $objective,
            'restructuredEntries' => $restructuredEntries,
            'classifications' => $data['classifications']
        ]);
    }


    // create
    public function create()
    {
        $data['classifications'] = Classification::with(['designations'])->get();
        // campus
        $data['campuses'] = DB::table('campuses')->get();

        return Inertia::render('Admin/CreateObjective', $data);
    }

    public function downloadObjectiveDocumentation($filename)
    {
        $path = storage_path('app/public/objective-documentation/' . $filename);

        if (!file_exists($path)) {
            dd("file_not");
            abort(404);
        }

        $headers = [
            'Content-Type' => 'application/pdf',
        ];

        return response()->download($path, $filename, $headers);
    }

    // storeObjective
    public function storeObjective(Request $request)
    {


        try {

            $request->validate([
                'title' => 'required',
                'objective_type' => 'required',
                'classificationIndex' => 'required',
                'campus_id' => 'required',
            ]);

            $objective = new Objective();

            // check first is submission_bin_id is not null
            if ($request->submission_bin_id != null) {

                $objective->title = $request->title;

                $objective->objective_type = $request->objective_type;
                $objective->submission_bin_id = $request->submission_bin_id;
                $objective->campus_id = $request->campus_id;
                $objective->due_date = $request->due_date;
                $objective->designation_id = $request->classificationIndex;
                $objective->save();
            } else {

                $objective->title = $request->title;
                $objective->objective_type = $request->objective_type;
                $objective->campus_id = $request->campus_id;
                $objective->due_date = $request->due_date;
                $objective->designation_id = $request->classificationIndex;
                $objective->submission_bin_id = null;
                $objective->save();

                // check entries if it is not null
                if ($request->requirements != null) {
                    foreach ($request->requirements as $requirement) {
                        ObjectiveEntry::create([
                            'objective_id' => $objective->id,
                            'description' => $requirement['requirement'],
                            'title' => $requirement['title'],
                        ]);
                    }
                }
            }

            $campus_id = (int)$request->campus_id;



            // all unitHeads where they have a designation of unit head and not null and campus_id
            $unitHeads = User::where('designation_id', $request->classificationIndex)->where('campus_id', $campus_id)->get();

            Notification::send($unitHeads, new NewTargetEvent($objective));

            foreach ($unitHeads as $unitHead) {
                UserObjective::create([
                    'objective_id' => $objective->id,
                    'user_id' => $unitHead->id,
                    'is_completed' => false,
                    'is_archived' => false
                ]);



                // get entries of the objective
                $entries = ObjectiveEntry::where('objective_id', $objective->id)->get();

                foreach ($entries as $entry) {
                    UserCheckoutEntry::create([
                        'objective_entry_id' => $entry->id,
                        'user_id' => $unitHead->id,
                        'status' => 0,
                        'completed_at' => null
                    ]);
                }
            }
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }

        return redirect()->route('admin.objectives');
    }

    // all
    public function all()
    {
        $objectives = Objective::all();


        // get entries
        foreach ($objectives as $objective) {
            $objective->entries;
        }

        // get classification
        foreach ($objectives as $objective) {
            $objective->designation;
        }

        // submission bin
        foreach ($objectives as $objective) {
            $objective->submissionBin;
        }

        return response()->json($objectives);
    }

    // update
    public function update(Request $request)
    {

        try {
            // dd($request->classificationIndex);
            $objective = Objective::find($request->id);

            $objective->update([
                'title' => $request->title,
                'objective_type' => $request->objective_type,
                'submission_bin_id' => $request->submission_bin_id,
                'designation_id' => $request->classificationIndex,
            ]);

            // check if requirements is not null
            if ($request->requirements != null) {
                ObjectiveEntry::where('objective_id', $objective->id)->delete();
                foreach ($request->requirements as $requirement) {
                    // remove first the entries

                    ObjectiveEntry::create([
                        'objective_id' => $objective->id,
                        'description' => $requirement['requirement'],
                        'title' => $requirement['title'],
                    ]);
                }
            }
            $objective->save();
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error updating objective' . $th->getMessage()], 500);
        }

        return redirect()->route('admin.objectives');
    }

    // delete
    public function delete($id)
    {
        try {
            $objective = Objective::find($id);
            $objective->delete();
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error deleting objective'], 500);
        }

        return response()->json(['message' => 'Objective deleted successfully'], 200);
    }

    // alluserobjectives
    public function allUserObjectives($id)
    {
        $userObjectives = UserObjective::where('user_id', $id)->where("is_archived", 0)->get();

        foreach ($userObjectives as $userObjective) {
            $userObjective->objective;

            // get user entries
            $userObjective->entries = UserCheckoutEntry::where('user_id', $id)->whereHas('objectiveEntry', function ($query) use ($userObjective) {
                $query->where('objective_id', $userObjective->objective_id);
            })->get();

            // get entries  
            foreach ($userObjective->entries as $entry) {
                $entry->objectiveEntry;
            }
        }


        return response()->json($userObjectives);
    }

    public function updateUserObjective(Request $request)
    {
        try {
            // Convert info_data to JSON string if it's an array
            if (is_array($request->info_data)) {
                $info_data = json_encode($request->info_data);
                $request->merge(['info_data' => $info_data]);
            }
            // Access the fields using the `get()` method
            $requestData = $request->all();

            $entry = UserCheckoutEntry::find($request->id);
            // get the user objective
            $userObjective = UserObjective::where('user_id', $entry->user_id)->where('objective_id', $entry->objectiveEntry->objective_id)->first();
            // get object due date
            $objective = Objective::find($userObjective->objective_id);

            if (strtotime(date('Y-m-d')) > strtotime($objective->due_date)) {
                $userObjective->status = 2; // due date is pass
                $userObjective->save();
            } else {
                $userObjective->status = 1; // ontime
                $userObjective->save();
            }


            $documentation = $requestData['documentation'] ?? null;

            $entry->update($requestData);


            if ($documentation) {
                // Generate a unique file name
                $filename = uniqid() . '.' . $documentation->getClientOriginalExtension();

                $path = $documentation->storeAs('public/objective-documentation', $filename);

                $entry->file_path = $filename;
                // save
                $entry->save();
            }
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error updating user objective' . $th->getMessage()], 500);
        }

        return response()->json(['message' => 'User objective updated successfully'], 200);
    }

    // updateObjective
    public function updateObjective(Request $request)
    {
        try {

            $objective = UserObjective::find($request->id);
            $objective->update($request->all());
            $objective->save();
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error updating objective' . $th->getMessage()], 500);
        }

        return response()->json(['message' => 'Objective updated successfully'], 200);
    }

    // getAllUsersObjective
    public function getUsersObjective(Request $request)
    {
        // Define quarters mapping
        $quarters = [
            '1' => [1, 2, 3],
            '2' => [4, 5, 6],
            '3' => [7, 8, 9],
            '4' => [10, 11, 12]
        ];

        $year = $request->input('year');
        $quarter = $request->input('quarter');
        $classificationId = $request->input('classificationIndex');
        $campus = $request->input('campus');
        $status = (int)$request->input('status');


        // Start query with base conditions
        $query = UserObjective::query();
        $query = $query->with('user', 'objective');

        // If both year and quarter are provided, add additional conditions
        if ($year && $quarter) {
            $query->whereYear('created_at', $year)->whereIn(DB::raw('MONTH(created_at)'), $quarters[$quarter]);
        }


        // Fetch user objectives with user and objective relationships with search conditions
        $userObjectives = $query->whereHas('user', function ($query) use ($classificationId, $campus, $status) {
            //    check if campus is not null
            if ($campus != null) {
                $query->where('campus_id', $campus);
            }

            // check if classificationId is not null
            if ($classificationId != null) {
                $query->where('designation_id', $classificationId);
            }

            // check if status is not null
            if ($status != null) {
                $query->where('admin_status', $status);
            }

            $query->where('is_archived', 0);
        })->get();


        // get UserCheckoutEntry
        foreach ($userObjectives as $userObjective) {
            $userObjective->entries = UserCheckoutEntry::where('user_id', $userObjective->user_id)->whereHas('objectiveEntry', function ($query) use ($userObjective, $campus) {
                $query->where('objective_id', $userObjective->objective_id);
            })->get();

            // get entries
            foreach ($userObjective->entries as $entry) {
                $entry->objectiveEntry;
            }
        }

        // Return JSON response
        return response()->json($userObjectives);
    }


    // getAllUsersObjective
    public function getUsersArchivedObjective(Request $request)
    {
        // Define quarters mapping
        $quarters = [
            '1' => [1, 2, 3],
            '2' => [4, 5, 6],
            '3' => [7, 8, 9],
            '4' => [10, 11, 12]
        ];

        $year = $request->input('year');
        $quarter = $request->input('quarter');
        $classificationId = $request->input('classificationIndex');
        $campus = $request->input('campus');

        // Start query with base conditions
        $query = UserObjective::query();
        $query = $query->with('user', 'objective');

        // If both year and quarter are provided, add additional conditions
        if ($year && $quarter) {
            $query->whereYear('created_at', $year)->whereIn(DB::raw('MONTH(created_at)'), $quarters[$quarter]);
        }


        // Fetch user objectives with user and objective relationships with search conditions
        $userObjectives = $query->whereHas('user', function ($query) use ($classificationId, $campus) {
            //    check if campus is not null
            if ($campus != null) {
                $query->where('campus_id', $campus);
            }

            // check if classificationId is not null
            if ($classificationId != null) {
                $query->where('designation_id', $classificationId);
            }

            $query->where('is_archived', 1);
        })->get();


        // get UserCheckoutEntry
        foreach ($userObjectives as $userObjective) {
            $userObjective->entries = UserCheckoutEntry::where('user_id', $userObjective->user_id)->whereHas('objectiveEntry', function ($query) use ($userObjective, $campus) {
                $query->where('objective_id', $userObjective->objective_id);
            })->get();

            // get entries
            foreach ($userObjective->entries as $entry) {
                $entry->objectiveEntry;
            }
        }

        // Return JSON response
        return response()->json($userObjectives);
    }

    // getAllUsersObjective
    public function getIndivUserArchivedObjective(Request $request)
    {
        // Define quarters mapping
        $quarters = [
            '1' => [1, 2, 3],
            '2' => [4, 5, 6],
            '3' => [7, 8, 9],
            '4' => [10, 11, 12]
        ];

        $year = $request->input('year');
        $quarter = $request->input('quarter');


        // Start query with base conditions
        $query = UserObjective::query();
        $query = $query->with('user', 'objective');

        // If both year and quarter are provided, add additional conditions
        if ($year && $quarter) {
            $query->whereYear('created_at', $year)->whereIn(DB::raw('MONTH(created_at)'), $quarters[$quarter]);
        }


        // Fetch user objectives with user and objective relationships with search conditions
        $userObjectives = $query->whereHas('user', function ($query) {


            $query->where('is_archived', 1);
        })->get();


        // get UserCheckoutEntry
        foreach ($userObjectives as $userObjective) {
            $userObjective->entries = UserCheckoutEntry::where('user_id', $userObjective->user_id)->whereHas('objectiveEntry', function ($query) use ($userObjective) {
                $query->where('objective_id', $userObjective->objective_id);
            })->get();

            // get entries
            foreach ($userObjective->entries as $entry) {
                $entry->objectiveEntry;
            }
        }

        // Return JSON response
        return response()->json($userObjectives);
    }







    // getUserArchiveObjective
    public function getArchivedUserObjective($id, Request $request)
    {

        // get user objectives
        $userObjectives = UserObjective::where('user_id', $id)->where("is_archived", 1)->with('objective')->get();

        // Return JSON response
        return response()->json($userObjectives);
    }

    // archiveUserObjective
    public function archiveUserObjective(Request $request)
    {
        try {
            $userObjective = UserObjective::find($request->id);
            $userObjective->is_archived = $userObjective->is_archived == 1 ? 0 : 1;
            $userObjective->save();
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error archiving user objective' . $th->getMessage()], 500);
        }

        return response()->json(['message' => 'User objective archived successfully'], 200);
    }

    // approveObjective
    public function approveObjective(Request $request)
    {

        try {
            $userObjective = UserObjective::find($request->id);
            $userObjective->admin_status = 1;
            // set is_archived to 1
            $userObjective->is_archived = 1;
            $userObjective->save();
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error approving user objective' . $th->getMessage()], 500);
        }

        return response()->json(['message' => 'User objective approved successfully'], 200);
    }

    // rejectObjective
    public function rejectObjective(Request $request)
    {
        try {
            $userObjective = UserObjective::find($request->id);
            $userObjective->admin_status = 2;
            $userObjective->comment = $request->comment;
            $userObjective->save();

            // get entries of the objective
            $entries = ObjectiveEntry::where('objective_id', $userObjective->objective_id)->get();

            foreach ($entries as $entry) {
                $userEntry = UserCheckoutEntry::where('objective_entry_id', $entry->id)->where('user_id', $userObjective->user_id)->first();
                $userEntry->status = false;
                $userEntry->save();
            }
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error rejecting user objective' . $th->getMessage()], 500);
        }

        return response()->json(['message' => 'User objective rejected successfully'], 200);
    }
}
