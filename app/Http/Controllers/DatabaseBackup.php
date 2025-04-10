<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessDbBackup;
use App\Models\DatabaseBackup as ModelsDatabaseBackup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class DatabaseBackup extends Controller
{
    public function index()
    {
        $backups = ModelsDatabaseBackup::latest()->get();
        return $backups;
    }

    public function backup()
    {
        $user_id = Auth::user()->id;
        ProcessDbBackup::dispatch($user_id);
    }

    public function download($file)
    {
        $filePath = storage_path("app/{$file}");
        if (file_exists($filePath)) {
            return Response::download($filePath);  // Serve the file for download
        } else {
            return back()->with('error', 'File not found.');  // Return error if file is not found
        }
    }
}