<?php

namespace App\Http\Controllers;

use App\Models\Product;
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
        //
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