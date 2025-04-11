<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $currentDate }} | Customer Balance Summary</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        h1,
        h3 {
            text-align: center;
            margin: 10px 0;
        }

        .container {
            padding: 16px;
            border: 1px solid #ccc;
        }

        .customer-section {
            margin-bottom: 24px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 12px;
        }

        .customer-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .customer-header h4 {
            margin: 0;
            font-size: 14px;
            color: #555;
        }

        .customer-name {
            font-weight: bold;
            font-size: 16px;
        }

        .adjustment,
        .transaction {
            margin-left: 16px;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .order-item {
            margin-left: 32px;
            font-size: 14px;
            margin-bottom: 6px;
        }

        .total-amount {
            margin-left: 32px;
            font-weight: bold;
            font-size: 14px;
        }

        .grand-total {
            margin-top: 12px;
            margin-left: 16px;
            font-weight: bold;
            font-size: 16px;
        }

        strong {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <h1>Customer Balance Summary</h1>
    <h3>{{ $currentDate }}</h3>

    <div class="container">
        @foreach ($customers as $customer)
            <div class="customer-section">
                <div class="customer-header" style="margin-bottom: 10px;">
                    <h4 class="customer-name" style="font-size: large;">{{ $customer->name }}</h4>
                    <h4>Outstanding Balance: P{{ number_format($customer->balance, 2) }}</h4>
                    <h4>Last Update: {{ \Carbon\Carbon::parse($customer->updated_at)->format('M j, Y') }}</h4>
                </div>

                @php
                    $grand_total = 0;
                    $combined = collect();

                    foreach ($customer->transactions as $transaction) {
                        if ($transaction->status === 'pending') {
                            $sale = $customer->sales->firstWhere('created_at', $transaction->created_at);
                            $combined->push([
                                'type' => $transaction->type,
                                'transaction' => $transaction,
                                'sale' => $sale,
                                'created_at' => $transaction->created_at,
                            ]);
                        }
                    }

                    $combined = $combined->sortBy('created_at');
                @endphp

                @foreach ($combined as $entry)
                    @php
                        $transaction = $entry['transaction'];
                        $sale = $entry['sale'];

                        if ($transaction->type === 'adjust') {
                            $grand_total = 0;
                            $grand_total = $transaction->updated_balance;
                        } else {
                            $grand_total += $transaction->amount;
                        }
                    @endphp

                    <div class="transaction">
                        <div style="position: relative; width: 100%; margin-bottom: -10px; margin-top: 5px;">
                            <strong>• {{ $transaction->message }}</strong>
                            <p style="position: absolute; right: 50px; margin: 0; font-style: italic;">
                                {{ \Carbon\Carbon::parse($transaction->created_at)->format('M j, Y') }}
                            </p>
                        </div>

                        {{-- If it's an adjustment --}}
                        @if ($transaction->type === 'adjust' || $transaction->type === 'borrow')
                            <div style="margin-left: 32px; position: relative; width: 100%; margin-top: 15px;">
                                Old Balance
                                <p style="position: absolute; right: 80px; margin: 0;">
                                    P{{ number_format($transaction->old_balance, 2) }}
                                </p>
                            </div>
                            <div
                                style="margin-left: 32px; position: relative; width: 100%; padding-top: 5px; padding-bottom: 10px;">
                                Amount Adjusted
                                <p style="position: absolute; right: 80px; margin: 0;">
                                    P{{ number_format($transaction->amount, 2) }}
                                </p>
                            </div>
                            <div style="margin-left: 32px; position: relative; width: 100%; color:#547086;">
                                <strong>Updated Balance</strong>
                                <p style="position: absolute; right: 80px; margin: 0;">
                                    <strong>P{{ number_format($transaction->updated_balance, 2) }}</strong>
                                </p>
                            </div>
                        @else
                            {{-- If it's a sale --}}
                            @if ($sale && $sale->order_items->count())
                                @foreach ($sale->order_items as $item)
                                    <div class="order-item" style="margin-bottom: -15px; margin-top: 5px;">
                                        <p style="margin-bottom: -10px;">{{ $item->product->name ?? 'N/A' }}</p>
                                        <div style="position: relative; width: 100%;">
                                            <p>P{{ number_format($item->bought_selling_price, 2) }} x
                                                {{ $item->quantity }} pcs</p>
                                            <p style="position: absolute; right: 50px; top: -20px; margin: 0;">
                                                P{{ number_format($item->sub_total, 2) }}
                                            </p>
                                        </div>
                                    </div>
                                @endforeach

                                <div class="total-amount"
                                    style="margin-top: 10px; position: relative; width: 100%; color:#636363;">
                                    Subtotal
                                    <p style="position: absolute; right: 80px; margin: 0;">
                                        P{{ number_format($transaction->amount, 2) }}
                                    </p>
                                </div>
                                <div
                                    style="margin-left: 32px; position: relative; width: 100%; margin-top: 5px; color:#547086;">
                                    <strong>Updated Balance</strong>
                                    <p style="position: absolute; right: 80px; margin: 0;">
                                        <strong>P{{ number_format($transaction->updated_balance, 2) }}</strong>
                                    </p>
                                </div>
                            @else
                                {{-- Fallback if sale data is missing --}}
                                <div style="margin-left: 32px; color: gray;">
                                    Sale details not found.
                                </div>
                            @endif
                        @endif
                    </div>
                @endforeach

                {{-- Grand Total --}}
                @if ($grand_total != 0)
                    <div class="grand-total"
                        style="position: relative; width: 100%; margin-top: 15px;  color: #26445a;">
                        Outstanding Balance
                        <p style="position: absolute; right: 65px; margin: 0; text-decoration: underline;">
                            P{{ number_format($grand_total, 2) }}
                        </p>
                    </div>
                @endif

            </div>
        @endforeach

    </div>
</body>

</html>

{{-- Match transactions with sales --}}
{{-- @foreach ($customer->sales as $sale)
                    @foreach ($customer->transactions as $transaction)
                        @if ($transaction->status === 'pending' && $transaction->created_at == $sale->created_at && $transaction->type !== 'adjust')
                            @php
                                $grand_total += $transaction->amount;
                            @endphp

                            <div class="transaction">
                                <div style="position: relative; width: 100%; margin-bottom: -5px;">
                                    <strong>{{ $transaction->message }}</strong>
                                    <p style="position: absolute; right: 50px; margin: 0; font-style: italic; ">
                                        {{ \Carbon\Carbon::parse($transaction->created_at)->format('M j, Y') }}
                                    </p>
                                </div>

                                @foreach ($sale->order_items as $item)
                                    <div class="order-item" style="margin-bottom: -15px;">
                                        <p style="margin-bottom: -10px;">{{ $item->product->name ?? 'N/A' }}</p>
                                        <div style="position: relative; width: 100%;">
                                            <p>P{{ number_format($item->bought_selling_price, 2) }} x
                                                {{ $item->quantity }} pcs</p>
                                            <p style="position: absolute; right: 50px; top: -20px; margin: 0;">
                                                P{{ number_format($item->sub_total, 2) }}
                                            </p>
                                        </div>
                                    </div>
                                @endforeach

                                <div class="total-amount" style="margin-top: 10px; position: relative; width: 100%;">
                                    Subtotal
                                    <p style="position: absolute; right: 80px; margin: 0;">
                                        P{{ number_format($transaction->amount, 2) }}
                                    </p>
                                </div>
                            </div>
                        @endif
                    @endforeach
                @endforeach --}}
