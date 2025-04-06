<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Pandak',
            'image' => '',
            'email' => 'admin@email.com',
            'password' => Hash::make('kentoy123'),
        ]);

        // $this->call([
        //     CustomerSeeder::class,
        //     ProductSeeder::class,
        // ]);
    }
}