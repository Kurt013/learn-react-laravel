<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class NoteController extends Controller
{

    public function show()
    {
        $user = auth()->user(); // full User model

        $notes = $user->notes()->latest('updated_at')->get();  // relationship

        return response()->json($notes);
    }

    public function store(Request $request)
    {
        $request->user()->notes()->create([
            'desc' => $request->desc
        ]);

        return response()->json('Note Created Successfully!');
    }

    public function edit(Request $request, int $id)
    {
        $note = Note::find($id);

        $note->update($request->all());

        return response()->json('Note Updated Successfully');
    }

    public function destroy(int $id)
    {
        try {
            $user = Note::find($id);

            if (!$user) return response()->json("Invalid", 401);

            $user->delete();

            return response()->json('Note deleted successfully!', 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json('Unexpected Error Occurred!', 500);
        }
    }
}
