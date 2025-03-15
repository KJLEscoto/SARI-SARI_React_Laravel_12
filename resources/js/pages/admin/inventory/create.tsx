import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

export default function Create() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Inventory',
      href: '/admin/inventory',
    },
    {
      title: 'Add Product',
      href: `/admin/inventory/create`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Add Product | Inventory' />
      <main className='p-4'>
        dsa
      </main>
    </AppLayout>
  );
}
