<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::all();
        $customers_count = Customer::count();

        return Inertia::render('admin/customers/index', compact('customers', 'customers_count'));
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
        $customer = Customer::find($id);

        if (!$customer) {
            return redirect()->route('admin.customers.index')->with('error', 'Customer not found.');
        }

        return Inertia::render('admin/customers/show', compact('customer'));
    }

    public function updateBalance(Request $request, string $id)
    {
        // Validate the request
        $validate = $request->validate([
            'update_balance' => 'required|numeric|min:0.01',
            'operator' => 'required|in:add,subtract',
        ]);

        // Find the customer
        $customer = Customer::findOrFail($id);

        // Update balance
        $amount = (float) $request->update_balance;
        if ($request->operator === 'add') {
            $customer->balance += $amount;
        } else {
            $customer->balance -= $amount;
        }

        $customer->save();

        return back()->with('update', 'Balance has been updated.');
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