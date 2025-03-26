<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BackupController extends Controller
{
    public function download($file)
    {
        // Define the storage path for backup files
        $filePath = "backup/{$file}";

        // Check if the file exists in storage
        if (!Storage::exists($filePath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // Return a streamed response to download the file
        return Storage::download($filePath);
    }
}