import React, { useState, useEffect } from "react";
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ClipboardCheck, ClipboardCopy, LucideIcon } from 'lucide-react';
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sales',
    href: '/admin/sales',
  },
];

interface Sale {
  id: number;
  status: string;
  sale: {
    status: string;
    customer: {
      id: number;
      name: string;
      image?: string;
    };
  };
  product: {
    id: number;
    name: string;
    image?: string;
  };
  bought_selling_price: number;
  quantity: number;
  sub_total: number;
  total_amount: number;
  created_at: string;
}

interface SalesListProps {
  title: string;
  icon: LucideIcon;
  status: string;
  sales: Sale[];
  getInitials: (name: string) => string;
}

const SalesList = ({ title, icon: Icon, status, sales, getInitials }: SalesListProps) => {
  const filteredSales = sales.filter((sale) => sale.sale.status === status);

  return (
    <section className="space-y-3 w-full">
      <div className="font-medium flex gap-1 items-center">
        <Icon className="w-5 h-5" />
        {title}
      </div>
      <Card className="overflow-auto max-h-80 border divide-y py-0 w-full rounded-md flex flex-col gap-0">
        {filteredSales.length > 0 ? (
          filteredSales.map((sale) => (
            <div className="w-full flex justify-between px-5 py-3 hover:bg-gray-50" key={sale.id}>
              <section className="flex gap-3 items-start w-1/2">
                {sale.product.image && (
                  <img
                    src={`/storage/${sale.product.image}`}
                    alt={`${sale.product.name} image`}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = '/images/no_image.jpeg')}
                  />
                )}
                <div className="flex flex-col gap-2 w-full">
                  <section className='w-full truncate'>
                    <Link href={route('inventory.show', sale.product.id)} className="text-xs font-semibold hover:underline">{sale.product.name}</Link>
                    <p className="text-sm">
                      ₱{Number(sale.bought_selling_price).toLocaleString('en-PH')} x {sale.quantity} pcs
                    </p>
                  </section>
                  <strong className='font-medium'>₱{Number(sale.sub_total).toLocaleString('en-PH')}</strong>
                </div>
              </section>

              <section className="flex flex-col items-center w-[50px] gap-2">
                {sale.sale.customer.image ? (
                  <img
                    src={`/storage/${sale.sale.customer.image}`}
                    alt={`${sale.sale.customer.name} image`}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = '/images/no_user.jpg')}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/70 dark:bg-[#404040] text-base text-white">
                    {getInitials(sale.sale.customer.name)}
                  </div>
                )}
                <Link href={route('customers.show', sale.sale.customer.id)} className="text-sm hover:underline">{sale.sale.customer.name}</Link>
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

const MostSold = ({ sales }: { sales: Sale[] }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // Default to current month
  );

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value);
  };

  // Filter sales by selected month
  const filteredSales = sales.filter((sale) => {
    const saleMonth = sale.created_at.slice(0, 7);
    return saleMonth === selectedMonth;
  });

  // Aggregate total quantity sold per product
  const productSalesMap: Record<number, { name: string; quantity: number; image?: string }> = {};

  filteredSales.forEach((sale) => {
    const id = sale.product.id;
    if (!productSalesMap[id]) {
      productSalesMap[id] = {
        name: sale.product.name,
        image: sale.product.image,
        quantity: 0,
      };
    }
    productSalesMap[id].quantity += sale.quantity;
  });

  const uniqueProductCount = new Set(filteredSales.map((sale) => sale.product.id)).size;

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, uniqueProductCount);

  const chartConfig: ChartConfig = {
    quantity: {
      label: "Quantity Sold",
      color: "hsl(0, 0%, 28%)",
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between -mb-8">
          <div className="space-y-1">
            <CardTitle>Sold Products</CardTitle>
            <CardDescription>Based on quantity sold</CardDescription>
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
        {topProducts.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-5">
            0 Product sold this month
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-auto">
            <BarChart
              data={topProducts}
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
                      e.currentTarget.href.baseVal = '/images/no_image.jpeg';
                    }}
                  />
                )}
              />
              <Tooltip
                content={(props) => {
                  const { active, payload } = props;
                  if (active && payload && payload.length > 0) {
                    const product = payload[0].payload;
                    return (
                      <ChartTooltipContent {...props} className="w-[200px]" nameKey="name" label={product.name} />
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="quantity" fill="var(--color-quantity)" radius={[0, 5, 5, 0]} />
            </BarChart>

          </ChartContainer>
        )}
      </CardContent>

    </Card>
  );
};


export default function Index({ related_sales }: { related_sales: any[] }) {
  const getInitials = useInitials();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sales" />
      <div className="flex h-full flex-1 flex-col gap-5 p-4">
        <MostSold sales={related_sales} />
        <div className="flex lg:flex-row flex-col gap-5 w-full">
          <SalesList title="Pending" icon={ClipboardCopy} status="pending" sales={related_sales} getInitials={getInitials} />
          <SalesList title="Paid" icon={ClipboardCheck} status="paid" sales={related_sales} getInitials={getInitials} />
        </div>
      </div>
    </AppLayout>
  );
}
