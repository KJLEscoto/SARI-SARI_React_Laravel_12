<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $currentDate }} | Customer Balance</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
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
    <h1>Customer Balance</h1>
    <h3>{{ $currentDate }}</h3>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Outstanding Balance</th>
                <th>Last Updated</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($customers as $customer)
                <tr style="font-size: 14px;">
                    <td>{{ $customer->name }}</td>
                    <td>P{{ number_format($customer->latestTransaction->updated_balance, 2) }}</td>
                    <td style="font-size: 12px;">
                        {{ $customer['updated_at'] ? \Carbon\Carbon::parse($customer->latestTransaction->created_at)->format('M j, Y') : 'N/A' }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
