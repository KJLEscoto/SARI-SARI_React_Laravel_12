<?php

use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\DownloadablesController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('admin/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('admin.dashboard');

    Route::resource('admin/pos', POSController::class);

    Route::resource('admin/inventory', InventoryController::class);
    Route::resource('admin/customers', CustomerController::class);
    Route::patch('admin/customers/{id}/update-balance', [CustomerController::class, 'updateBalance'])->name('update_balance');
    Route::patch('admin/customers/{id}/update-transaction-status', [CustomerController::class, 'updateTransactionStatus'])->name('update_transaction_status');
    Route::post('admin/customers/{id}', [CustomerController::class, 'showOrderHistory'])->name('order-history');

    Route::resource('admin/sales', SaleController::class);
    Route::resource('admin/transactions', TransactionController::class);

    Route::resource('admin/downloadables', DownloadablesController::class);
    Route::get('/download-products-pdf', [DownloadablesController::class, 'downloadProductsPdf'])->name('product-list');
    Route::get('/download-customer-balance', [DownloadablesController::class, 'downloadCustomerBalancePdf'])->name('customer-balance');
    Route::get('/download-customer-pending-orders', [DownloadablesController::class, 'downloadCustomerPendingOrdersPdf'])->name('customer-pending-orders');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';