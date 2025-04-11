import Cards from '@/components/downloadables-card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Downloadables',
    href: '/admin/downloadables',
  },
];

export default function Index() {

  const handleProductList = () => {
    window.location.href = route('product-list'); // Triggers the PDF download
  };

  const handleCustomerBalance = () => {
    window.location.href = route('customer-balance'); // Triggers the PDF download
  };

  const handleCustomerPendingOrders = () => {
    window.location.href = route('customer-pending-orders'); // Triggers the PDF download
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Downloadables" />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="text-2xl font-semibold flex items-start gap-1">
          <h1>Downloadables</h1>
        </div>

        <p className="text-black/75 dark:text-white/80">Downloadable versions of important files.</p>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          <Cards title='Product List' description='List of products in the inventory' onClick={handleProductList} />
          <Cards title='Pending Balance' description='Unsettled oustanding balance' onClick={handleCustomerBalance} />
          <Cards title='Customer Balance Summary' description='Transaction details & balance' onClick={handleCustomerPendingOrders} />
        </div>
      </div>
    </AppLayout>
  );
}
