<?php

namespace App\Concerns;

use App\Models\DatabaseBackup;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

trait BackupDatabase
{
  protected function performBackup(int $user_id)
  {
    try {
      $database = config('database.connections.mysql.database');
      $username = config('database.connections.mysql.username');
      $password = config('database.connections.mysql.password');
      $host = config('database.connections.mysql.host');
      $port = config('database.connections.mysql.port');
      $mysqldump = 'C:\xampp\mysql\bin\mysqldump.exe';

      $date_now = now()->format('M-d-Y_H-i-s');
      $gzip_file_name = "DB_{$date_now}.sql.gz";
      $gzip_file_path = storage_path("app/{$gzip_file_name}");

      if (!file_exists(dirname($gzip_file_path))) {
        mkdir(dirname($gzip_file_path), 0777, true); // Create directory if it doesn't exist
      }

      $command = "\"$mysqldump\" --user={$username} --password={$password} --host={$host} --port={$port} {$database} | gzip > \"{$gzip_file_path}\"";

      exec($command, $output, $result);

      DatabaseBackup::create([
        'path' => $gzip_file_path,
        'user_id' => $user_id
      ]);

      if ($result) {
        Log::error('Backup failed for user ' . $user_id . implode('\n', $output));
        throw new \Exception('Database backup failed.');
      }

      Log::info("Database backup created by user ID {$user_id}: {$gzip_file_path}");

      return $gzip_file_name;
    } catch (\Exception $e) {
      Log::error('Database backup failed: ' . $e->getMessage());
      return $e;
    }
  }
}