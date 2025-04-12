<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory;

    protected $guarded = [];
    protected $table = 'customers';

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function latestTransaction()
    {
        return $this->hasOne(Transaction::class)->latest(); // Get the latest transaction for each customer
    }

}