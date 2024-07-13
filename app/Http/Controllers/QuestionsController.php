<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionsController extends Controller
{
    // ipcrindex, ipcredit, ipcrcreate, ipcrstore, ipcrupdate, ipcrdestroy
    public function ipcrindex()
    {

        $search = request()->query('search');

        // check if search is not empty
        if ($search) {

            // // with user
            // $questions = Question::where('question_type', 0)
            //     ->where('title', 'LIKE', "%{$search}%")
            //     ->with('user')
            //     ->paginate(10);

            // all non-archived questions
            $questions = Question::where('question_type', 0)
                ->where('isArchived', 0)
                ->where('title', 'LIKE', "%{$search}%")
                ->with('user')
                ->paginate(10);
        } else {

            // // with user
            // $questions = Question::where('question_type', 0)->with('user')->paginate(10);

            // all non-archived questions
            $questions = Question::where('question_type', 0)->where('isArchived', 0)->with('user')->paginate(10);
        }

        return Inertia::render(
            'Question/IPCRIndex',
            [
                'ipcrs' => $questions
            ]
        );
    }

    public function ipcredit($id, Request $request)
    {

        // question where id is equal to $id and question_type is 0
        $question = Question::where('id', $id)->where('question_type', 0)->first();


        return Inertia::render(
            'Question/IPCREdit',
            [
                'question' => $question,
                'currentPage' => $request->page ?? 1
            ]
        );
    }

    public function ipcrcreate()
    {
        // only get non archived questions
        $questions = Question::where('question_type', 0)->where('isArchived', 0)->get();

        return Inertia::render('Question/IPCRCreate');
    }

    public function ipcrstore(Request $request)
    {
        //dd($request->all());

        try {

            // create a new question
            Question::create([
                'question_type' => 0,
                'isQRequired' => $request->isQRequired,
                'isERequired' => $request->isERequired,
                'isTRequired' => $request->isTRequired,
                'target_indicators' => $request->targetIndicator,
                'remarks' => $request->remarks,
                'title' => $request->title,
                // 'user_id' => auth()->user()->id,
                // 'edited_at' => now(),
            ]);




            return redirect()->route('ipcrquestion.index')->with('message', 'Question created successfully.');
        } catch (\Throwable $th) {
            //throw $th;
            dd($th->getMessage());
            return redirect()->back()->with('message', 'Please fill up the required fields.');
        }
    }

    public function ipcrupdate(Request $request, $id)
    {
        //dd($request->all());

        try {

            // find the question where id is equal to $id and question_type is 0
            $question = Question::where('id', $id)->where('question_type', 0)->first();


            // update the question
            $question->update([
                'isQRequired' => $request->isQRequired,
                'isERequired' => $request->isERequired,
                'isTRequired' => $request->isTRequired,
                'target_indicators' => $request->targetIndicator,
                'remarks' => $request->remarks,
                'title' => $request->title,
                'user_id' => auth()->user()->id,
                'edited_at' => now(),
            ]);

            // return redirect()->route('ipcrquestion.index')->with('message', 'Question updated successfully.');
            // redirect to ipcrquestion with page query
            return redirect()->route('ipcrquestion.index', ['page' => $request->page])->with('message', 'Question updated successfully.');
        } catch (\Throwable $th) {
            //throw $th;
            dd($th->getMessage());
            return redirect()->back()->with('message', 'Please fill up the required fields.');
        }
    }

    public function ipcrdestroy($id)
    {
        // find the question where id is equal to $id and question_type is 0
        $question = Question::where('id', $id)->where('question_type', 0)->first();

        // delete the question
        $question->delete();

        return redirect()->route('ipcrquestion.index')->with('message', 'Question deleted successfully.');
    }

    //opcrindex, opcredit, opcrcreate, opcrstore, opcrupdate, opcrdestroy
    public function opcrindex()
    {

        $search = request()->query('search');

        // check if search is not empty
        if ($search) {

            // // with user
            // $questions = Question::where('question_type', 1)
            //     ->where('title', 'LIKE', "%{$search}%")
            //     ->with('user')
            //     ->paginate(10);

            // all non-archived questions
            $questions = Question::where('question_type', 1)
                ->where('isArchived', 0)
                ->where('title', 'LIKE', "%{$search}%")
                ->with('user')
                ->paginate(10);
        } else {

            // // with user
            // $questions = Question::where('question_type', 1)->with('user')->paginate(10);

            // all non-archived questions
            $questions = Question::where('question_type', 1)->where('isArchived', 0)->with('user')->paginate(10);
        }

        return Inertia::render(
            'Question/OPCRIndex',
            [
                'opcrs' => $questions
            ]
        );
    }

    public function opcredit($id, Request $request)
    {
        $question = Question::find($id);

        return Inertia::render(
            'Question/OPCREdit',
            [
                'question' => $question,
                'currentPage' => $request->page ?? 1
            ]
        );
    }

    public function opcrcreate()
    {
        return Inertia::render('Question/OPCRCreate');
    }

    public function opcrstore(Request $request)
    {
        //dd($request->all());

        try {

            // create a new question
            Question::create([
                'question_type' => 1,
                'isQRequired' => $request->isQRequired,
                'isERequired' => $request->isERequired,
                'isTRequired' => $request->isTRequired,
                'target_indicators' => $request->targetIndicator,
                'remarks' => $request->remarks,
                'supporting_documents' => $request->supportingDocuments,
                'individuals_accountable' => $request->individualsAccountable,
                'title' => $request->title,
                // 'user_id' => auth()->user()->id,
                // 'edited_at' => now(),
            ]);

            return redirect()->route('opcrquestion.index')->with('message', 'Question created successfully.');
        } catch (\Throwable $th) {
            //throw $th;
            dd($th->getMessage());
            return redirect()->back()->with('message', 'Please fill up the required fields.');
        }
    }

    public function opcrupdate(Request $request, $id)
    {
        //dd($request->all());

        try {

            // find the question where id is equal to $id and question_type is 0
            $question = Question::where('id', $id)->where('question_type', 1)->first();

            // update the question
            $question->update([
                'isQRequired' => $request->isQRequired,
                'isERequired' => $request->isERequired,
                'isTRequired' => $request->isTRequired,
                'target_indicators' => $request->targetIndicator,
                'remarks' => $request->remarks,
                'supporting_documents' => $request->supportingDocuments,
                'individuals_accountable' => $request->individualsAccountable,
                'title' => $request->title,
                'user_id' => auth()->user()->id,
                'edited_at' => now(),
            ]);



            // return redirect()->route('opcrquestion.index')->with('message', 'Question updated successfully.');
            // redirect to opcrquestion with page query
            return redirect()->route('opcrquestion.index', ['page' => $request->page])->with('message', 'Question updated successfully.');
        } catch (\Throwable $th) {
            //throw $th;
            dd($th->getMessage());
            return redirect()->back()->with('message', 'Please fill up the required fields.');
        }
    }

    public function opcrdestroy($id)
    {
        // find the question where id is equal to $id and question_type is 0
        $question = Question::where('id', $id)->where('question_type', 1)->first();

        // delete the question
        $question->delete();

        return redirect()->route('opcrquestion.index')->with('message', 'Question deleted successfully.');
    }

    public function archive($id)
    {
        // find the question where id is equal to $id
        $question = Question::find($id);

        // update the question
        $question->update([
            'isArchived' => 1,
        ]);

        $question->save();

        return redirect()->back()->with('message', 'Question archived successfully.');
    }

    public function unarchive($id)
    {
        // find the question where id is equal to $id
        $question = Question::find($id);

        // update the question
        $question->update([
            'isArchived' => 0,
        ]);

        $question->save();

        return redirect()->back()->with('message', 'Question unarchived successfully.');
    }

    public function ipcrarchives()
    {
        // todo
        // // get all archived ipcr questions
        // $questions = Question::where('question_type', 0)->where('isArchived', 1)->paginate(10);

        // search
        $search = request()->query('search');

        // check if search is not empty
        if ($search) {

            // all non-archived questions
            $questions = Question::where('question_type', 0)
                ->where('isArchived', 1)
                ->where('title', 'LIKE', "%{$search}%")
                ->with('user')
                ->paginate(10);
        } else {
            // all non-archived questions
            $questions = Question::where('question_type', 0)->where('isArchived', 1)->paginate(10);
        }

        return Inertia::render(
            'Question/IPCRArchive',
            [
                'ipcrs' => $questions
            ]
        );
    }

    public function opcrarchives()
    {
        // // todo
        // // get all archived ipcr questions
        // $questions = Question::where('question_type', 0)->where('isArchived', 0)->paginate(10);

        // search
        $search = request()->query('search');

        // check if search is not empty
        if ($search) {

            // all non-archived questions
            $questions = Question::where('question_type', 1)
                ->where('isArchived', 1)
                ->where('title', 'LIKE', "%{$search}%")
                ->with('user')
                ->paginate(10);
        } else {
            // all non-archived questions
            $questions = Question::where('question_type', 1)->where('isArchived', 1)->paginate(10);
        }

        return Inertia::render(
            'Question/OPCRArchive',
            [
                'opcrs' => $questions
            ]
        );
    }
}
