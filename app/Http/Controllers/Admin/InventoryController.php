<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Customer;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            // 'category' => $validated['category'],
            'stock' => $validated['stock'],
            'selling_price' => $validated['selling_price'],
            'market_price' => $validated['market_price'],
            'expiration_date' => $validated['expiration_date'] ?? null,
            'image' => $path,
        ]);

        return Redirect::route('inventory.index')->with('success', $validated['name'] . ' has been added.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return redirect()->route('admin.inventory.index')->with('error', 'Product not found.');
        }

        $profit = $product->profit();

        $product_sold = OrderItem::where('product_id', $product->id)->count();
        $sum_product_sold = OrderItem::where('product_id', $product->id)->sum('quantity');

        $price_history = ProductPrice::with(['product', 'user'])
            ->where('product_id', $product->id)
            ->latest()
            ->get();
        $price_history_count = ProductPrice::where('product_id', $product->id)->count();

        // Step 1: Get sale IDs where this product is sold
        // $sale_ids = OrderItem::where('product_id', $product->id)->pluck('sale_id');

        // Step 2: Get related customers who bought the product
        // $customers = Customer::whereIn('id', function ($query) use ($sale_ids) {
        //     $query->select('customer_id')
        //         ->from('sales')
        //         ->whereIn('id', $sale_ids);
        // })->get();

        // Optional: If you want to check the customer list
        // dd($customers);

        $related_sales = OrderItem::with([
            'product',
            'sale.customer'
        ])
            ->where('product_id', $product->id)
            ->latest()
            ->get();

        return Inertia::render('admin/inventory/show', compact(
            'product',
            'profit',
            'product_sold',
            'sum_product_sold',
            'price_history',
            'price_history_count',
            // 'customers'
            'related_sales'
        ));
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

        ProductPrice::create([
            'product_id' => $product->id,
            'old_selling_price' => $product->selling_price,
            'old_market_price' => $product->market_price,
            'new_selling_price' => $validated['selling_price'],
            'new_market_price' => $validated['market_price'],
            'user_id' => Auth::user()->id,
        ]);

        $product->update([
            'name' => $validated['name'],
            'stock' => $validated['stock'],
            'selling_price' => $validated['selling_price'],
            'market_price' => $validated['market_price'],
            'expiration_date' => $validated['expiration_date'] ?? null,
            'image' => $path,
        ]);

        return Redirect::route('inventory.show', $product->id)->with('update', str($product->name) . ' has been updated.');
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

        if (!empty($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return Redirect::route('inventory.index')->with('success', str($product->name) . ' has been deleted.');
    }

}