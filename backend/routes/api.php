<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/login', [LoginController::class, 'login'])->middleware('throttle:10,1');
Route::post('/register', [LoginController::class, 'register'])->middleware('throttle:10,1');

Route::middleware('auth:sanctum', 'throttle:10,1')->group(function () {
    Route::prefix('user')->group(function () {
        Route::get('/', function (Request $request) {
            return $request->user();
        });
        Route::controller(UserController::class)->group(function () {
            Route::get('/{id}', 'show');
            Route::put('/{id}', 'edit');
            Route::delete('/{id}', 'destroy');
        });
    });

    Route::prefix('note')->group(function () {
        Route::controller(NoteController::class)->group(function () {
            Route::get('/', 'show');
            Route::post('/', 'store');
            Route::put('/{id}', 'edit');
            Route::delete('/{id}', 'destroy');
        });
    });

    Route::get('/logout', [LoginController::class, 'logout']);
});
