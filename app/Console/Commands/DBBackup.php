<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;

class DBBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:dbbackup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        info(now());
        $timestamp = now()->format("m-d-Y_H-i-s"); // Replace spaces with underscores
        $path = Storage::path("backup/DB_{$timestamp}.gz");

        $db_username = env('DB_USERNAME');
        $db_password = env('DB_PASSWORD');
        $db_host = env('DB_HOST');
        $db_name = env('DB_DATABASE');
        $mysqldump = 'mysqldump';

        // Wrap the file path in double quotes
        $command = sprintf(
            '%s --user=%s --password=%s --host=%s %s | gzip > "%s"',
            $mysqldump,
            escapeshellarg($db_username),
            escapeshellarg($db_password),
            escapeshellarg($db_host),
            escapeshellarg($db_name),
            $path
        );

        $process = Process::run($command);

        if ($process->successful()) {
            $this->info("Backup created successfully: " . basename($path));
        } else {
            $this->error("Backup failed: " . $process->errorOutput());
        }
    }

}