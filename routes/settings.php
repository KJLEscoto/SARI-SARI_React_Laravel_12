<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('admin/settings', 'settings/profile')->name('settings');

    Route::get('admin/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('admin/settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::post('admin/settings/profile', [ProfileController::class, 'updateImage'])->name('profile.updateImage');

    Route::delete('admin/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('admin/settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('admin/settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('admin/settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::get('admin/settings/system', function () {
        return Inertia::render('settings/system');
    })->name('system');
});