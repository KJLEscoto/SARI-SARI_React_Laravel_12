import AppLayout from '@/layouts/app-layout';
import { Customer, Flash, Product, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import dayjs from "dayjs";
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ChevronLeft, Edit3, Minus } from "lucide-react";
import { MoreDetails } from '@/components/more-details';

export default function Show({ customer }: { customer: Customer }) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Customers',
      href: '/admin/customers',
    },
    {
      title: customer.name,
      href: `/admin/customers/${customer.id}`,
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
      <Head title={`${customer.name} | Customers`} />
      <div className="h-full flex flex-col gap-10 p-4">

        <section className='flex gap-2 w-full justify-end'>
          <Link href={route("customers.index")}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Link href={route("customers.edit", customer.id)}>
            <Button variant="default" size="sm">
              Edit Account
              <Edit3 className="w-4 h-4" />
            </Button>
          </Link>
        </section>

        <section className="flex md:flex-row flex-col md:items-start items-center gap-5">
          <img src={customer.image ? `/storage/${customer.image}` : "/images/no_image.jpeg"} alt={`${customer.name} image`} className="w-1/4 h-fit rounded-lg object-cover" onError={(e) => (e.currentTarget.src = "/images/no_image.jpeg")} />

          <div className='w-full divide-y *:p-5'>
            <section className='flex justify-between gap-5'>
              <div className='space-y-1'>
                <p className='text-2xl font-bold'>{customer.name}</p>
                {/* <p className='bg-gray-300 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-300 w-fit px-3 py-1 rounded-full'>{product.category}</p> */}
              </div>
            </section>

            <section className='flex justify-between items-center flex-wrap gap-3'>
              <div className='space-y-1'>
                <p className=''>Outstanding Balance :
                  <span className={`font-semibold ml-1.5
                    ${customer.balance <= 500 ? "text-green-500" :
                      customer.balance <= 999 ? "text-blue-500" :
                        customer.balance > 1000 ? "text-red-500" : ""}
                  `}>
                    ₱ {Number(customer.balance).toLocaleString("en-PH")}
                  </span>
                </p>
              </div>
              <Button variant='secondary' size='default'>
                Update Balance
                <Minus className="w-4 h-4" />
              </Button>
            </section>

            <section className="flex flex-col gap-3">
              <h1 className='font-semibold'>Transaction History</h1>
              <div className='*:p-5 *:text-gray-700 *:dark:text-gray-300 border *:hover:bg-gray-50 *:dark:hover:bg-black rounded-lg divide-y overflow-y-auto overflow-x-hidden h-60'>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h1 className='font-semibold'>More Details</h1>
              <div className='*:p-5 *:text-gray-700 *:dark:text-gray-300 border *:hover:bg-gray-50 *:dark:hover:bg-black rounded-lg divide-y overflow-hidden'>
                <MoreDetails label="Customer ID" value={customer.id} />
                <MoreDetails label="Contact No." value={customer.phone} />
                <MoreDetails label="Address" value={customer.address} />
                <MoreDetails label="Date Joined" value={dayjs(customer.created_at).format('MMM DD, YYYY | hh:mm a')} />
                <MoreDetails label="Last Update" value={dayjs(customer.updated_at).format('MMM DD, YYYY | hh:mm a')} />
              </div>
            </section>
          </div>

        </section>
      </div>
    </AppLayout>
  );
}
