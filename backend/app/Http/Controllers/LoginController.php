<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Throwable;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $userValidate = $request->validate([
            'email' => 'required|email',
            'password' => ['required', Password::min(8)->letters()->numbers()],
        ]);

        try {
            if (!Auth::attempt($userValidate)) return response()->json('Wrong credentials', 401);

            $request->session()->regenerate();

            return response()->json(Auth::user());
        } catch (\Throwable $e) {
            Log::error($e->getMessage());
            return response()->json('unexpected error occurred!', 500);
        }
    }

    public function register(Request $request)
    {
        $userValidate = $request->validate([
            'name' => 'required|string|min:2',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
        ]);

        try {
            User::create([
                'name' => $userValidate['name'],
                'email' => $userValidate['email'],
                'password' => Hash::make($userValidate['password'])
            ]);
            return response()->json('User registered successfully!', 201);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json('Unexpected error occurred!', 500);
        }
    }

    public function logout(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json('Logout Successfully', 200);
    }
}
