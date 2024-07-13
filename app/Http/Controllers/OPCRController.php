<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Opcr;
use App\Models\qeta;
use App\Models\Question;
use App\Models\teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OPCRController extends Controller
{
    // index, create, store, show, edit, update, destroy
    public function index()
    {
        try {
            // get all opcrs with paginate 10 per page

            $opcrs = opcr::all();

            $search = request()->query('search');

            // dd($search);

            if ($search) {
                // opcrs with user, it must search firstname, middlename, lastname
                $opcrs = opcr::with('user')->whereHas('user', function ($query) use ($search) {
                    $query->where('firstname', 'LIKE', '%' . $search . '%')
                        ->orWhere('middlename', 'LIKE', '%' . $search . '%')
                        ->orWhere('lastname', 'LIKE', '%' . $search . '%');
                })->paginate(10);


                //dd($opcrs);

                // render
                return Inertia::render(
                    'OPCR/Index',
                    [
                        'opcrs' => $opcrs
                    ]
                );
            } else {
                // opcrs get all and get user and teacher
                $opcrs = opcr::with('user')->paginate(10);

                return Inertia::render(
                    'OPCR/Index',
                    [
                        'opcrs' => $opcrs
                    ]
                );
            }
        } catch (\Throwable $th) {
            //throw $th;
            dd($th);
        }
    }

    // print
    public function print($id)
    {
        // get opcr
        $opcr = opcr::find($id);

        // get all qeta from $opcr
        $qetas = $opcr->qeta;

        // convert qetas to array
        $qetas = $qetas->toArray();

        // add all qetas to opcr
        $opcr->qetas = $qetas;

        // get teacher
        $opcr->teacher = User::find($opcr->teacher_id);

        // evaluator
        $opcr->evaluator = $opcr->user;

        // questions where question_type is 1
        $questions = Question::where('question_type', 1)->get();

        // qeta
        foreach ($opcr->qeta as $qeta) {

            // access question
            $qeta->question = $qeta->question;
        }

        // return view
        return Inertia::render(
            'OPCR/Print',
            [
                'opcr' => $opcr,
                'questions' => $questions
            ]
        );
    }

    public function create()
    {

        // questions where question_type is 1
        $questions = Question::where('question_type', 1)->where("isArchived", 0)->get();

        return Inertia::render(
            'OPCR/Create',
            [

                'questions' => $questions
            ]
        );
    }

    public function store(Request $request)
    {
        //dd($request->all());
        try {
            // Validate the evaluatee selection
            if (empty($request->evaluatee)) {
                return redirect()->back()->with('message', 'Please select an evaluatee.');
            }

            if (empty($request->comments)) {
                return redirect()->back()->with('message', 'Please fill comments section');
            }

            // check if from and to is empty
            if (empty($request->from) || empty($request->to)) {
                return redirect()->back()->with('message', 'Please fill from and to section');
            }

            // Loop through the formData and perform validation
            for ($i = 0; $i < count($request->formData); $i++) {
                $question = $request->formData[$i];

                // Validate if all fields for this question are filled
                $fieldsToCheck = ['q', 'e', 't', 'a', 'actual_accomplishments', 'alloted_budgets'];
                foreach ($fieldsToCheck as $field) {
                    if ($field !== 'a' && ($question[$field] !== null && $question[$field] === '')) {
                        return redirect()->back()->with('message', 'Please fill all the fields.');
                    }
                }

                // Validate if all fields are numeric
                $numericFields = ['q', 'e', 't', 'a', 'alloted_budgets'];
                foreach ($numericFields as $field) {
                    if ($field !== 'a' && (!is_numeric($question[$field]) && $question[$field] !== '' && $question[$field] !== null)) {
                        return redirect()->back()->with('message', 'Please fill all the fields with numeric values.');
                    }
                }

                // Validate if fields are within the range of 1-5
                $rangeFields = ['q', 'e', 't', 'a'];
                foreach ($rangeFields as $field) {
                    $value = $question[$field];
                    if ($field !== 'a' && ($value !== null && ($value < 1 || $value > 5))) {
                        return redirect()->back()->with('message', 'Please fill all the fields with values within 1-5.');
                    }
                }
            }

            // Create opcr first
            $opcr = opcr::create([
                'user_id' => auth()->user()->id,
                'teacher_id' => $request->evaluatee,
                'comments' => $request->comments,
                'from' => $request->from,
                'to' => $request->to,
            ]);

            //dd($opcr->id);

            // Loop through the formData and create qeta records
            for ($i = 0; $i < count($request->formData); $i++) {
                $question = $request->formData[$i];

                // Create qeta record
                qeta::create([
                    'q' => $question['q'],
                    'e' => $question['e'],
                    't' => $question['t'],
                    'a' => $question['a'],
                    'mfa_type' => "opcr-q" . ($i + 1),
                    'actual_accomplishments' => $question['actual_accomplishments'],
                    'alloted_budgets' => $question['alloted_budgets'],
                    'question_id' => $question['id'], // Use the question ID from the form
                    'opcr_id' => $opcr->id, // Use the created opcr ID
                ]);
            }

            // Redirect to opcr index
            return redirect()->route('opcr.index')->with('message', 'opcr successfully created.');
        } catch (\Throwable $th) {
            // Handle exceptions
            dd($th);
        }
    }



    public function show($id)
    {
        $opcr = opcr::find($id);

        // get all qetas
        $qetas = $opcr->qeta;

        // convert qetas to array
        $qetas = $qetas->toArray();

        // add all qetas to opcr
        $opcr->qetas = $qetas;

        // get teacher
        $opcr->teacher = User::find($opcr->teacher_id);

        // evaluator
        $opcr->evaluator = $opcr->user;

        // questions where question_type is 1
        $questions = Question::where('question_type', 1)->get();

        return Inertia::render(
            'OPCR/Show',
            [
                'opcr' => $opcr,
                'questions' => $questions
            ]
        );
    }

    public function edit($id)
    {
        // get opcr
        $opcr = opcr::find($id);

        // get all qeta from $opcr
        $qetas = $opcr->qeta;

        // convert qetas to array
        $qetas = $qetas->toArray();

        // add all qetas to opcr
        $opcr->qetas = $qetas;



        // questions where question_type is 1
        $questions = Question::where('question_type', 1)->get();

        return Inertia::render(
            'OPCR/Edit',
            [
                'opcr' => $opcr,

                'questions' => $questions
            ]
        );
    }

    public function update(Request $request, $id)
    {


        try {
            //dd($request->all());
            // Validate the evaluatee selection
            if (empty($request->evaluatee)) {
                return redirect()->back()->with('message', 'Please select an evaluatee.');
            }

            if (empty($request->comments)) {
                return redirect()->back()->with('message', 'Please fill comments section');
            }

            // check if from and to is empty
            if (empty($request->from) || empty($request->to)) {
                return redirect()->back()->with('message', 'Please fill from and to section');
            }

            // Loop through the formData and perform validation
            for ($i = 0; $i < count($request->formData); $i++) {
                $question = $request->formData[$i];

                // Validate if all fields for this question are filled
                $fieldsToCheck = ['q', 'e', 't', 'a', 'actual_accomplishments', 'alloted_budgets'];
                foreach ($fieldsToCheck as $field) {
                    if (empty($question[$field])) {
                        return redirect()->back()->with('message', 'Please fill all the fields.');
                    }
                }

                // Validate if all fields are numeric
                $numericFields = ['q', 'e', 't', 'a', 'alloted_budgets'];
                foreach ($numericFields as $field) {
                    if (!is_numeric($question[$field])) {
                        return redirect()->back()->with('message', 'Please fill all the fields with numeric values.');
                    }
                }

                // Validate if fields are within the range of 1-5
                $rangeFields = ['q', 'e', 't', 'a'];
                foreach ($rangeFields as $field) {
                    $value = $question[$field];
                    if ($value < 1 || $value > 5) {
                        return redirect()->back()->with('message', 'Please fill all the fields with values within 1-5.');
                    }
                }

                // Update qeta record
                $qeta = qeta::where('mfa_type', 'opcr-q' . ($i + 1))->where('opcr_id', $id)->first();
                $qeta->update([
                    'q' => $question['q'],
                    'e' => $question['e'],
                    't' => $question['t'],
                    'a' => $question['a'],
                    'mfa_type' => "opcr-q" . ($i + 1),
                    'actual_accomplishments' => $question['actual_accomplishments'],
                    'alloted_budgets' => $question['alloted_budgets'],
                    'opcr_id' => $id,
                ]);
                //dd($qeta);
                $qeta->save();
            }

            $opcr = opcr::find($id);

            //dd($request->evaluatee);
            $opcr->update([
                'user_id' => auth()->user()->id,
                'teacher_id' => $request->evaluatee,
                'comments' => $request->comments,
                'from' => $request->from,
                'to' => $request->to,
            ]);
            $opcr->save();

            // Redirect to opcr index
            return redirect()->route('opcr.index')->with('message', 'opcr successfully updated.');
        } catch (\Throwable $th) {
            // Handle exceptions
            dd($th);
        }
    }



    public function destroy($id)
    {
        // delete
        $opcr = Opcr::find($id);
        $opcr->delete();

        // redirect
        return redirect()->route('opcr.index')->with('message', 'opcr successfully deleted.');
    }
}
