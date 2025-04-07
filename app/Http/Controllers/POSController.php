<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class POSController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::orderBy('name', 'asc')->get();
        $cashier = Auth::user()->id;
        $customers = Customer::orderBy('name', 'asc')->get();

        return Inertia::render('admin/pos/index', compact('products', 'cashier', 'customers'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());

        // Validate request

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.sub_total' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'status' => 'required|string|in:pending,paid',
            'customer_id' => 'required|exists:customers,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $customer = Customer::find($validated['customer_id']);
        if (!$customer) {
            Log::error('Invalid customer ID in purchase order: ' . $validated['customer_id']);
            return Redirect::back()->with('error', 'Invalid customer ID.');
        }

        // Create a new transaction
        $sale = Sale::create([
            'customer_id' => $validated['customer_id'],
            'total_amount' => $validated['total_amount'],
            'payment_method' => $validated['payment_method'],
            'status' => $validated['status'],
            'user_id' => $validated['user_id'],
        ]);

        $old_balance = $customer->balance;
        if ($validated['status'] == 'pending') {
            $customer->balance += $validated['total_amount'];
            Transaction::create([
                'customer_id' => $customer->id,
                'user_id' => Auth::user()->id,
                'message' => 'Ordered a product',
                'amount' => $validated['total_amount'],
                'type' => 'order',
                'status' => $validated['status'],
                'old_balance' => $old_balance,
                'updated_balance' => $customer->balance,
            ]);
            $customer->save();
        } else {
            Transaction::create([
                'customer_id' => $customer->id,
                'user_id' => Auth::user()->id,
                'message' => 'Ordered a product',
                'amount' => $validated['total_amount'],
                'type' => 'order',
                'status' => $validated['status'],
                'old_balance' => $old_balance,
                'updated_balance' => $customer->balance,

            ]);
        }

        // Loop through items and save each to the database
        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);

            if ($product) {
                $product->decrement('stock', $item['quantity']);
                OrderItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'bought_selling_price' => $product->selling_price,
                    'bought_market_price' => $product->market_price,
                    'sub_total' => $item['sub_total'],
                ]);
            }
        }

        return Redirect::back()->with('success', 'Order has been purchased by ' . $customer->name . '.');
    }
}