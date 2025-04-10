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

        <div className="grid grid-cols-3 gap-5">
          <section className="flex flex-wrap gap-2 justify-between w-full items-center px-4 py-2 border rounded-sm">
            <h2>List of Products</h2>
            <Button type="button" variant="default" size="sm" onClick={handleProductList}>
              Download
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </section>

          <section className="flex flex-wrap gap-2 justify-between w-full items-center px-4 py-2 border rounded-sm">
            <h2>Customer Balance</h2>
            <Button type="button" variant="default" size="sm" onClick={handleCustomerBalance}>
              Download
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </section>

          <section className="flex flex-wrap gap-2 justify-between w-full items-center px-4 py-2 border rounded-sm">
            <h2>Customer Pending Orders</h2>
            <Button type="button" variant="default" size="sm" onClick={handleCustomerPendingOrders}>
              Download
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
