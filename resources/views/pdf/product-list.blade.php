<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product List</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }

        h1 {
            margin-top: 0px;
        }

        h1,
        h3 {
            text-align: center;
            margin: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        td {
            word-wrap: break-word;
        }
    </style>
</head>

<body>
    <h1>Product List</h1>
    <h3>{{ $currentDate }}</h3>
    <span style="margin-right: 5px;"><strong>M.P.</strong> (Market Price)</span>
    <span><strong>S.P.</strong> (Selling Price)</span>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Stock</th>
                <th>M.P.</th>
                <th>S.P.</th>
                <th>Expiration</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($products as $product)
                <tr>
                    <td>{{ $product['name'] }}</td>
                    <td>{{ number_format($product['stock']) }}</td>
                    <td>
                        @if ($product['market_price'] <= 0)
                            -
                        @else
                            P{{ number_format($product['market_price'], 2) }}
                        @endif
                    </td>
                    <td>P{{ number_format($product['selling_price'], 2) }}</td>
                    {{-- <td> {{ \Carbon\Carbon::parse($product['expiration_date'])->format('M j, Y') }}</td> --}}
                    {{-- <td>{{ $product['expiration_date'] }}</td> --}}
                    <td style="font-size: 12px;">{{ $product['expiration_date'] ? $product['expiration_date'] : 'N/A' }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
