<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $products = Product::all(); //Get all non-deleted products (default behavior)
        // $trashedProducts = Product::onlyTrashed()->get(); //Get only soft-deleted products
        // $allProducts = Product::withTrashed()->get(); //Get all products, including soft-deleted ones


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
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }

    // restore product
    // public function restore($id)
    // {
    //     $product = Product::onlyTrashed()->findOrFail($id);
    //     $product->restore();

    //     return redirect()->route('inventory.index')->with('success', "{$product->name} has been restored.");
    // }

    // permanently delete
    // public function forceDelete($id)
    // {
    //     $product = Product::onlyTrashed()->findOrFail($id);
    //     $product->forceDelete();

    //     return redirect()->route('inventory.index')->with('success', "{$product->name} has been permanently deleted.");
    // }

    // routes
    // Route::patch('/inventory/{id}/restore', [ProductController::class, 'restore'])->name('inventory.restore');
    // Route::delete('/inventory/{id}/force-delete', [ProductController::class, 'forceDelete'])->name('inventory.forceDelete');

    // Restore Button
    // <Button variant="outline" size="sm" onClick={() => router.patch(route('inventory.restore', { id: row.original.id }))}>
    //   Restore
    // </Button>

    // Permanent Delete Button
    // <Button variant="destructive" size="sm" onClick={() => router.delete(route('inventory.forceDelete', { id: row.original.id }))}>
    //   Permanently Delete
    // </Button>
}