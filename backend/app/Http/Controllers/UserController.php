<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Throwable;

class UserController extends Controller
{
    public function show(int $id)
    {
        $user = User::find($id);

        if (!$user) return response()->json("Invalid", 401);

        return $user;
    }

    public function edit(Request $request, int $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes',
            'password' => 'sometimes|min:6'
        ]);

        try {
            $user = User::find($id);

            if (!$user) return response()->json("Invalid", 401);

            if ($validated['password'])
                $validated['password'] = Hash::make($validated['password']);

            $user->update($validated);

            return response()->json('User updated successfully!', 200);
        } catch (\Throwable $e) {
            Log::error($e->getMessage());
            return response()->json('Unexpected Error Occurred!', 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $user = User::find($id);

            if (!$user) return response()->json("Invalid", 401);

            $user->delete();

            return response()->json('User deleted successfully!', 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json('Unexpected Error Occurred!', 500);
        }
    }
}
