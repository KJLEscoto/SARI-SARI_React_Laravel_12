import AppLayout from '@/layouts/app-layout';
import { Product, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import dayjs from "dayjs";

export default function Show({ product, profit }: { product: Product, profit: number }) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Inventory',
      href: '/admin/inventory',
    },
    {
      title: product.name,
      href: `/admin/inventory/${product.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${product.name} | Inventory`} />
      <div className="h-full flex flex-col gap-10 p-4">
        <section className="flex lg:flex-row flex-col gap-5">
          <img src={product.image ? `/storage/${product.image}` : "/images/no_image.jpeg"} alt={`${product.name} image`} className="lg:w-[700px] h-[300px] rounded-lg object-cover" onError={(e) => (e.currentTarget.src = "/images/no_image.jpeg")} />

          <div className='w-full divide-y divide-gray-200 *:p-5'>
            <section className='flex gap-2 w-full justify-end'>
              <Link href={route("inventory.index")}>
                <Button variant="outline" size="sm">Back</Button>
              </Link>
              <Button variant="default" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </section>

            <section className='flex justify-between gap-5'>
              <div>
                <p className='text-2xl font-bold'>{product.name}</p>
                <p className='bg-gray-300 text-xs font-bold text-gray-500 w-fit px-3 py-1 rounded-full'>{product.category}</p>
              </div>
              <div className='text-end text-sm'>
                <p className='text-black'>Stock : <strong>{product.stock}</strong></p>
                <p className='text-black'>Sold : <strong>0</strong></p>
              </div>
            </section>

            <section className='flex justify-between gap-5'>
              <div className='flex flex-row gap-3'>
                <div className='p-3 bg-black text-white rounded-lg'>
                  <p className='text-xs'>Selling Price</p>
                  <p className='text-lg font-semibold'>₱{product.selling_price}</p>
                </div>
                <div className='p-3 border rounded-lg'>
                  <p className='text-xs'>Market Price</p>
                  <p className='text-black text-lg font-semibold'>₱{product.market_price}</p>
                </div>
              </div>
              <div className='text-end text-sm'>
                <p className={profit < 1 ? 'text-red-700' : 'text-green-700'}>
                  {profit < 0 ? 'Loss' : 'Gain'} : <strong>₱{profit.toFixed(2)}</strong>
                </p>
              </div>
            </section>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h1 className='font-semibold'>More Details</h1>
          <div className='*:p-5 *:text-gray-700 border border-gray-100 *:hover:bg-gray-50 rounded-lg divide-y divide-gray-200'>
            <p><span className='font-semibold text-sm'>Product ID :</span> {product.id}</p>
            <p><span className='font-semibold text-sm'>Expiration Date :</span> {dayjs(product.expiration_date).format('MMM DD, YYYY ') || 'N/A'}</p>
            <p><span className='font-semibold text-sm'>Product Added :</span> {dayjs(product.created_at).format('MMM DD, YYYY | hh:mm a')}</p>
            <p><span className='font-semibold text-sm'>Last Update :</span> {dayjs(product.updated_at).format('MMM DD, YYYY | hh:mm a')}</p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
