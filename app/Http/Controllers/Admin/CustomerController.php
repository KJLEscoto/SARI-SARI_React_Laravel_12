<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
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
        return Inertia::render('admin/customers/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            // Move the image to 'storage/app/public/customers' and store the path
            $path = Storage::disk('public')->put('customers', $request->file('image'));
        } else {
            $path = null;
        }

        // Create a new product
        Customer::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'image' => $path,
        ]);

        return Redirect::route('customers.index')->with('success', $validated['name'] . ' has been added.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $customer = Customer::with([
            'transactions' => function ($query) {
                $query->latest();
            }
        ])->withCount('transactions')->findOrFail($id);

        return Inertia::render('admin/customers/show', [
            'customer' => $customer,
            'transactions' => $customer->transactions,
            'transactionCount' => $customer->transactions_count, // This will return the total number of transactions
        ]);
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
            Transaction::create([
                'customer_id' => $customer->id,
                'message' => 'Borrowed an amount of:',
                'amount' => $amount,
                'type' => 'borrow',
                'updated_balance' => $customer->balance,
            ]);
        } else {
            $customer->balance -= $amount;
            Transaction::create([
                'customer_id' => $customer->id,
                'message' => 'Paid an amount of:',
                'amount' => $amount,
                'type' => 'pay',
                'updated_balance' => $customer->balance,
            ]);
        }

        $customer->save();

        return back()->with('update', 'Balance has been updated.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return Redirect::back()->with('error', 'Customer not found.');
        }

        return Inertia::render('admin/customers/edit', compact('customer'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, string $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($customer->image) {
                Storage::disk('public')->delete($customer->image);
            }
            $path = Storage::disk('public')->put('customers', $request->file('image'));
        } else {
            $path = $customer->image; // Keep the old image
        }

        // Update customer details
        $customer->update([
            'name' => $validated['name'],
            // 'category' => $validated['category'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'image' => $path,
        ]);

        return Redirect::route('customers.show', $customer->id)->with('update', str($customer->name) . ' has been updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}