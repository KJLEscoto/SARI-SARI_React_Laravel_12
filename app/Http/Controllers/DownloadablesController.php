<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Sale;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DownloadablesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/downloadables/index');
    }

    public function downloadProductsPdf()
    {
        $products = Product::orderBy('name', 'asc')->get();
        $currentDate = \Carbon\Carbon::now()->format('M d, Y');
        $pdf_date = \Carbon\Carbon::now()->format('Y-M-j');

        // Load a view that will be converted to PDF
        $pdf = Pdf::loadView('pdf.product-list', compact('products', 'currentDate'))
            ->setOptions(['isHtml5ParserEnabled' => true, 'isPhpEnabled' => true, 'encoding' => 'UTF-8'])
            // ->setPaper('legal');
            ->setPaper([0, 0, 612, 936]);

        // Download the PDF
        return $pdf->download("Product-List-{$pdf_date}.pdf");
    }

    public function downloadCustomerBalancePdf()
    {
        $customers = Customer::orderBy('name', 'asc')->get();
        $currentDate = \Carbon\Carbon::now()->format('M d, Y');
        $pdf_date = \Carbon\Carbon::now()->format('Y-M-j');

        // Load a view that will be converted to PDF
        $pdf = Pdf::loadView('pdf.customer-balance', compact('customers', 'currentDate'))
            ->setOptions(['isHtml5ParserEnabled' => true, 'isPhpEnabled' => true, 'encoding' => 'UTF-8'])
            // ->setPaper('legal');
            ->setPaper([0, 0, 612, 936], 'landscape');

        // Download the PDF
        return $pdf->download("Customer-Balance-{$pdf_date}.pdf");
    }

    public function downloadCustomerPendingOrdersPdf()
    {
        // $customers = Customer::with(['transactions', 'sales'])->orderBy('name', 'asc')->get();
        $customers = Customer::with([
            'transactions',
            'sales.order_items.product'
        ])->orderBy('name', 'asc')->get();

        $currentDate = \Carbon\Carbon::now()->format('M d, Y');
        $pdf_date = \Carbon\Carbon::now()->format('Y-M-j');

        // $customer_transactions = [];
        // $pending_items = [];

        // foreach ($customers as $customer) {
        //     // dd($customer->transactions);

        //     $pending_transactions = $customer->transactions->where('status', 'pending');
        //     foreach ($pending_transactions as $transaction) {
        //         $customer_transactions[] = $transaction;

        //         foreach ($customer->sales as $sale) {
        //             $order_items = OrderItem::with('product')->where('sale_id', $sale->id)->get();

        //             foreach ($order_items as $items) {
        //                 $pending_items[] = $items;
        //             }
        //         }
        //     }
        // }

        // Load a view that will be converted to PDF
        $pdf = Pdf::loadView('pdf.customer-balance-summary', compact('customers', 'currentDate'))
            ->setOptions(['isHtml5ParserEnabled' => true, 'isPhpEnabled' => true, 'encoding' => 'UTF-8'])
            // ->setPaper('legal');
            ->setPaper([0, 0, 612, 20000], 'portrait');

        // Download the PDF
        return $pdf->download("Customer-Pending-Orders-{$pdf_date}.pdf");
    }
}