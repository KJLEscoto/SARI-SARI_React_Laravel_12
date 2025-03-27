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

    // public function orders() : HasMany
    // {
    //     // return $this->hasMany(Order::class);
    // }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}