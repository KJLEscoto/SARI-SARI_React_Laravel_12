import AppLayout from '@/layouts/app-layout';
import { Flash, Product, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import dayjs from "dayjs";
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ChevronLeft, Edit3, Trash2 } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


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

  const { flash } = usePage<{ flash: Flash }>().props;

  const handleDelete = (id: number) => {
    router.delete(route("inventory.destroy", { id }));
  };

  useEffect(() => {
    if (flash.update) {
      toast.info(flash.update);
    }
    else if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${product.name} | Inventory`} />
      <div className="h-full flex flex-col gap-10 p-4">

        <section className='flex gap-2 w-full justify-end'>
          <Link href={route("inventory.index")}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Link href={route("inventory.edit", product.id)}>
            <Button variant="default" size="sm">
              <Edit3 className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger>
              {/* <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}> */}
              <Button variant="destructive" size="sm">
                Delete
                <Trash2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Delete Confirmation</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
                Are you sure you want to delete '<strong>{product.name}</strong>' ?
              </DialogDescription>
              <DialogFooter className="flex w-full justify-end gap-3">
                <DialogClose asChild>
                  <Button type="button" size="sm" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button variant="destructive" type="submit" size="sm" onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <section className="flex md:flex-row flex-col md:items-start items-center gap-5">
          <img src={product.image ? `/storage/${product.image}` : "/images/no_image.jpeg"} alt={`${product.name} image`} className="w-1/4 h-fit rounded-lg object-cover" onError={(e) => (e.currentTarget.src = "/images/no_image.jpeg")} />

          <div className='w-full divide-y *:p-5'>
            <section className='flex justify-between gap-5'>
              <div className='space-y-1'>
                <p className='text-2xl font-bold'>{product.name}</p>
                {/* <p className='bg-gray-300 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-300 w-fit px-3 py-1 rounded-full'>{product.category}</p> */}
              </div>
              <div className='text-end text-sm text-black dark:text-white space-y-1'>
                <p>Available Stock : <strong>{product.stock}</strong></p>
                <p>Total Sold : <strong>0</strong></p>
              </div>
            </section>

            <section className='flex justify-between gap-5'>
              <div className='flex flex-row gap-3'>
                <div className='p-3 bg-black dark:bg-white text-white dark:text-black rounded-lg'>
                  <p className='text-xs'>Selling Price</p>
                  <p className='text-lg font-semibold'>₱{product.selling_price}</p>
                </div>
                <div className='p-3 border dark:border-white/50 text-black dark:text-white rounded-lg'>
                  <p className='text-xs'>Market Price</p>
                  <p className='text-lg font-semibold'>₱{product.market_price}</p>
                </div>
              </div>
              <div className='text-end text-sm'>
                <p className={profit < 1 ? 'text-red-700 dark:text-red-500' : 'text-green-700 dark:text-green-500'}>
                  {profit < 0 ? 'Loss' : 'Gain'} : <strong>₱{profit}</strong>
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h1 className='font-semibold'>More Details</h1>
              <div className='*:p-5 *:text-gray-700 *:dark:text-gray-300 border *:hover:bg-gray-50 *:dark:hover:bg-black rounded-lg divide-y overflow-hidden'>
                <p><span className='font-semibold text-sm'>Product ID :</span> {product.id}</p>
                <p>
                  <span className="font-semibold text-sm">Expiration Date :</span>{" "}
                  {product.expiration_date
                    ? dayjs(product.expiration_date).format("MMM DD, YYYY")
                    : "N/A"}
                </p>
                <p><span className='font-semibold text-sm'>Product Added :</span> {dayjs(product.created_at).format('MMM DD, YYYY | hh:mm a')}</p>
                <p><span className='font-semibold text-sm'>Last Update :</span> {dayjs(product.updated_at).format('MMM DD, YYYY | hh:mm a')}</p>
              </div>
            </section>
          </div>

        </section>
      </div>
    </AppLayout>
  );
}
