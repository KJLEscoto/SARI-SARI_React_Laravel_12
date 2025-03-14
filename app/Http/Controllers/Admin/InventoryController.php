<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inventory = 'this is inventory haha';
        return Inertia::render('admin/inventory/index', compact('inventory'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // ✅ Fixed PHP Array Syntax
        $products = [
            [
                "id" => 1,
                "image" => "/images/no_image.jpeg",
                "name" => "Laptop",
                "category" => "Electronics",
                "stock" => 10,
                "sellingPrice" => "₱50,000",
                "expirationDate" => "N/A",
            ],
            [
                "id" => 2,
                "image" => "/images/no_image.jpeg",
                "name" => "Milk",
                "category" => "Dairy",
                "stock" => 30,
                "sellingPrice" => "₱80",
                "expirationDate" => "Sept 25, 2025",
            ],
            [
                "id" => 3,
                "image" => "/images/no_image.jpeg",
                "name" => "Shampoo",
                "category" => "Personal Care",
                "stock" => 20,
                "sellingPrice" => "₱150",
                "expirationDate" => "Sept 25, 2025",
            ],
        ];

        // ✅ Find the product using `array_filter`
        $product = collect($products)->firstWhere('id', (int) $id);

        // ✅ Handle if product is not found
        if (!$product) {
            return redirect()->route('admin.inventory.index')->with('error', 'Product not found.');
        }

        return Inertia::render('admin/inventory/show', compact('product'));
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}