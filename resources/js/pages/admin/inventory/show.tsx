import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Show({ product }: {
  product: { id: number; name: string; category: string; stock: number; sellingPrice: string; expirationDate: string; image: string }
}) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Inventory',
      href: '/admin/inventory',
    },
    {
      title: `${product.name}`,
      href: `/admin/inventory/${product.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${product.name}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* <h1 className="text-2xl font-semibold">Inventory Details</h1> */}
        <p>Viewing details for <strong>{product.name}</strong> (ID: {product.id})</p>

        <div className="flex gap-4 mt-4">
          <img src={product.image} alt={product.name} className="w-32 h-32 rounded-lg object-cover border" />
          <div>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Selling Price:</strong> {product.sellingPrice}</p>
            <p><strong>Expiration Date:</strong> {product.expirationDate}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
