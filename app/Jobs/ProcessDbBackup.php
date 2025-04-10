<?php

namespace App\Jobs;

use App\Concerns\BackupDatabase;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessDbBackup implements ShouldQueue
{
    use Queueable, BackupDatabase;

    // public $timeout = 200;

    /**
     * Create a new job instance.
     */
    public function __construct(public int $user_id)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $backup_file = $this->performBackup($this->user_id);
        } catch (\Exception $e) {

        }
    }
}