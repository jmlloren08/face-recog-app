<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\FacialDataPointsController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    Route::get('/attendance-sheet', function () {
        return Inertia::render('Attendance');
    })->name('attendance');
    Route::post('/store-time-in-out', [AttendanceController::class, 'store']);
    Route::get('/get-employee-details/{employeeId}', [AttendanceController::class, 'getEmployeeDetails']);
    Route::get('/get-images', [ImageController::class, 'getImages']);
    Route::get('/get-list-of-attendees', [AttendanceController::class, 'getAttendances']);
    Route::post('/store-facial-data-points', [FacialDataPointsController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
