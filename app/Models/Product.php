<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $table = 'products';
    protected $dates = ['deleted_at'];

    public function profit(): float
    {
        return (float) number_format($this->selling_price - $this->market_price, 2, '.', '');
    }

    public function order_items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function product_prices(): HasMany
    {
        return $this->hasMany(ProductPrice::class);
    }
}