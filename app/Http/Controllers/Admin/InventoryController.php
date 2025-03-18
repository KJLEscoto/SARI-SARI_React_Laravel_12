<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all();
        $inventory_count = Product::count();

        return Inertia::render('admin/inventory/index', compact('products', 'inventory_count'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/inventory/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        // dd($request->all());
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            // Move the image to 'storage/app/public/products' and store the path
            $path = Storage::disk('public')->put('products', $request->file('image'));
        } else {
            $path = null;
        }

        // Create a new product
        Product::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'stock' => $validated['stock'],
            'selling_price' => $validated['selling_price'],
            'market_price' => $validated['market_price'],
            'expiration_date' => $validated['expiration_date'] ?? null,
            'image' => $path,
        ]);

        return Redirect::route('inventory.index')->with('success', 'Product has been added.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        $product = Product::find($id);
        $profit = $product->profit();

        if (!$product) {
            return redirect()->route('admin.inventory.index')->with('error', 'Product not found.');
        }

        return Inertia::render('admin/inventory/show', compact('product', 'profit'));
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return Redirect::back()->with('error', 'Product not found.');
        }

        return Inertia::render('admin/inventory/edit', compact('product'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, string $id)
    {

        $product = Product::findOrFail($id);

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $path = Storage::disk('public')->put('products', $request->file('image'));
        } else {
            $path = $product->image; // Keep the old image
        }

        // Update product details
        $product->update([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'stock' => $validated['stock'],
            'selling_price' => $validated['selling_price'],
            'market_price' => $validated['market_price'],
            'expiration_date' => $validated['expiration_date'] ?? null,
            'image' => $path,
        ]);

        return Redirect::route('inventory.show', $product->id)->with('update', 'Product has been update.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return Redirect::back()->with('error', 'Product not found.');
        }

        Storage::disk('public')->delete($product->image);
        $product->delete();

        return Redirect::back()->with('success', 'Product has been deleted.');
    }
}