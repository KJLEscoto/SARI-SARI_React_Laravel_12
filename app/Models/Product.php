<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $table = 'products';

    public function profit(): float
    {
        return (float) number_format($this->selling_price - $this->market_price, 2, '.', '');
    }

}