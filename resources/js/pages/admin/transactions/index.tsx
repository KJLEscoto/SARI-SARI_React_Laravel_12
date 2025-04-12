
"use client"
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ClipboardCheck, ClipboardCopy, History, LucideIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import dayjs from 'dayjs';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sales',
    href: '/admin/sales',
  },
];

// interface Sale {
//   id: number;
//   status: string;
//   sale: {
//     status: string;
//     customer: {
//       id: number;
//       name: string;
//       image?: string;
//     };
//   };
//   product: {
//     id: number;
//     name: string;
//     image?: string;
//   };
//   bought_selling_price: number;
//   quantity: number;
//   sub_total: number;
//   total_amount: number;
//   created_at: string;
// }

interface TransactionListProps {
  title: string;
  icon: LucideIcon;
  status: string;
  transactions: any[];
  getInitials: (name: string) => string;
}

const TransactionList = ({ title, icon: Icon, transactions, getInitials }: TransactionListProps) => {
  // const filteredSales = sales.filter((sale) => sale.sale.status === status);

  return (
    <section className="space-y-3 w-full">
      <div className="font-medium flex gap-1 items-center">
        <Icon className="w-5 h-5" />
        {title}
        <span className='text-sm'>
          {transactions.length > 0 && transactions.length}
        </span>
      </div>
      <Card className="overflow-auto max-h-60 border divide-y py-0 w-full rounded-md flex flex-col gap-0">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div className="w-full flex justify-between px-5 py-3 hover:bg-gray-50" key={transaction.id}>
              <section className="flex gap-3 items-start">
                <div className="flex flex-col gap-2">
                  <section className='space-y-1'>
                    <h1 className="text-sm">
                      {transaction.message}
                      <span className='mx-1.5'>
                        •
                      </span>
                      <span className={transaction.status === 'pending' ? 'text-blue-500' : 'text-green-500'}>
                        {
                          transaction.status
                        }
                      </span>
                    </h1>
                    <strong className='font-medium'>₱{Number(transaction.amount).toLocaleString('en-PH')}</strong>
                  </section>
                  <p className='text-xs font-medium text-black/70'>{dayjs(transaction.created_at).format("MMM DD, YYYY")}</p>
                </div>
              </section>

              <section className="flex flex-col items-center w-[50px] gap-2">
                {transaction.customer.image ? (
                  <img
                    src={`/storage/${transaction.customer.image}`}
                    alt={`${transaction.customer.name} image`}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = '/images/no_user.jpg')}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/70 dark:bg-[#404040] text-base text-white">
                    {getInitials(transaction.customer.name)}
                  </div>
                )}
                <Link href={route('customers.show', transaction.customer.id)} className="text-sm hover:underline">{transaction.customer.name}</Link>
              </section>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-500 py-4">0 {title}</div>
        )}
      </Card>

    </section>
  );
};

const MostTransaction = ({ transactions }: { transactions: any[] }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format("YYYY-MM"));

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
  };

  const filteredTransactions = transactions.filter((t) =>
    dayjs(t.date).format("YYYY-MM") === selectedMonth
  );


  const customerTransactionMap: Record<number, {
    id: number;
    name: string;
    image?: string;
    transaction_count: number;
  }> = {};

  filteredTransactions.forEach((t) => {
    const id = t.customer.id;
    if (!customerTransactionMap[id]) {
      customerTransactionMap[id] = {
        id,
        name: t.customer.name,
        image: t.customer.image,
        transaction_count: 0,
      };
    }
    customerTransactionMap[id].transaction_count += 1;
  });

  const uniqueCustomerCount = new Set(transactions.map(t => t.customer.id)).size;

  const topCustomers = Object.values(customerTransactionMap)
    .sort((a, b) => b.transaction_count - a.transaction_count)
    .slice(0, uniqueCustomerCount);

  const chartConfig: ChartConfig = {
    transaction_count: {
      label: "Transactions",
      color: "hsl(0, 0%, 28%)",
    },
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between -mb-8'>
          <div className='space-y-1'>
            <CardTitle>Most Transactions</CardTitle>
            <CardDescription>Based on customer transaction count</CardDescription>
          </div>
          <div>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {topCustomers.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-5">
            0 Transactions this month
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-[350px]">
            <BarChart
              data={topCustomers}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="10 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="image"
                type="category"
                tick={({ x, y, payload }) => (
                  <image
                    href={`/storage/${payload.value}`}
                    x={x - 35}
                    y={y - 15}
                    width={30}
                    height={30}
                    onError={(e) => {
                      e.currentTarget.href.baseVal = '/images/no_user.jpg';
                    }}
                  />
                )}
              />
              <Tooltip
                content={(props) => {
                  const { active, payload } = props;
                  if (active && payload && payload.length > 0) {
                    const customer = payload[0].payload;
                    return (
                      <ChartTooltipContent
                        {...props}
                        className="w-[200px]"
                        nameKey="name"
                        label={customer.name}
                      />
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="transaction_count"
                fill="var(--color-transaction_count)"
                radius={[0, 5, 5, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

    </Card>
  );
}


export default function Index({ transactions }: { transactions: any[] }) {
  const getInitials = useInitials();
  console.log(transactions);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sales" />
      <div className="flex h-full flex-1 flex-col gap-5 p-4">
        <MostTransaction transactions={transactions} />

        <div className="flex lg:flex-row flex-col gap-5 w-full">
          <TransactionList title="Transaction History" icon={History} status="pending" transactions={transactions} getInitials={getInitials} />
        </div>

      </div>
    </AppLayout>
  );
}
