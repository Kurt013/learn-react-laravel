<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class NoteController extends Controller
{

    public function show()
    {
        try {
            $user = auth()->user();
            $notes = $user->notes()->latest('updated_at')->get();
            return response()->json($notes);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json('Unexpected Error Occurred!', 500);
        }
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'desc' => ['required', 'string', 'max:1000'],
        ]);

        try {
            $request->user()->notes()->create($data);
            return response()->json('Note Created Successfully!', 201);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json('Unexpected Error Occurred!', 500);
        }
    }

    public function edit(Request $request, int $id)
    {
        $data = $request->validate([
            'desc' => ['required', 'string', 'max:1000'],
        ]);

        try {
            $note = $request->user()->notes()->find($id);
            if (!$note) return response()->json('Not found', 404);

            $note->update($data);

            return response()->json('Note Updated Successfully', 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json('Unexpected Error Occurred!', 500);
        }
    }

    public function destroy(Request $request, int $id)
    {
        try {
            $note = $request->user()->notes()->find($id);
            if (!$note) return response()->json('Not found', 404);

            $note->delete();

            return response()->json('Note deleted successfully!', 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json('Unexpected Error Occurred!', 500);
        }
    }
}
