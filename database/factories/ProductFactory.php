<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $size = '1000/1000'; // Set image size (Width/Height)
        $randomSeed = rand(0, 10000); // Generates a random seed for unique images

        return [
            'name' => $this->faker->word(),
            // 'category' => $this->faker->randomElement(['Electronics', 'Clothing', 'Food', 'Accessories']),
            'stock' => $this->faker->numberBetween(1, 100),
            'selling_price' => $this->faker->randomFloat(2, 10, 500),
            'market_price' => $this->faker->randomFloat(2, 10, 500),
            'expiration_date' => rand(0, 1) ? now()->addDays(rand(1, 365)) : null,
            'image' => '', // ✅ Generates a unique random image
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}