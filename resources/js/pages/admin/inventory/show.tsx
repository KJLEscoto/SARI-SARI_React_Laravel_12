import AppLayout from '@/layouts/app-layout';
import { Product, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from "dayjs";
import { ChevronLeft, Edit3, Trash2 } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MoreDetails } from '@/components/more-details';
import PriceHistory from '@/components/price-history';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function Show({ product, profit, product_sold, sum_product_sold = 0, price_history, price_history_count }: { product: Product, profit: number, product_sold: number, sum_product_sold: number, price_history: any[], price_history_count: number }) {
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


  const handleDelete = (id: number) => {
    router.delete(route("inventory.destroy", { id }));
  };

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
          {/* <Dialog>
            <DialogTrigger>
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
                  <Button type="button" size="sm" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button variant="destructive" type="submit" size="sm" onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </section>

        <section className="flex md:flex-row flex-col md:items-start items-center gap-5">
          <img src={product.image ? `/storage/${product.image}` : "/images/no_image.jpeg"} alt={`${product.name} image`} className="w-1/4 h-fit rounded-lg object-cover" onError={(e) => (e.currentTarget.src = "/images/no_image.jpeg")} />

          <div className='w-full *:p-5'>
            <section className='flex gap-3 md:flex-row flex-col w-full'>
              <div className='space-y-1 w-full'>
                <p className='text-2xl font-bold'>{product.name}</p>
                {/* <p className='bg-gray-300 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-300 w-fit px-3 py-1 rounded-full'>{product.category}</p> */}
              </div>
              <div className='text-end w-full text-sm text-black dark:text-white space-y-1 *:text-nowrap'>
                <p>Available Stock : <strong>{product.stock.toLocaleString("en-PH")}</strong></p>
                <p>Total Sold : <strong>{sum_product_sold.toLocaleString("en-PH")}</strong></p>
              </div>
            </section>

            <section className='flex justify-between flex-wrap gap-3 border-y'>
              <div className='flex flex-row flex-wrap gap-3 w-full'>
                <div className='p-3 bg-black dark:bg-white text-white dark:text-black rounded-lg text-nowrap'>
                  <p className='text-xs'>Selling Price</p>
                  <p className='text-lg font-semibold'>₱{Number(product.selling_price).toLocaleString("en-PH")}</p>
                </div>
                <div className='p-3 border dark:border-white/50 text-black dark:text-white rounded-lg text-nowrap'>
                  <p className='text-xs'>Market Price</p>
                  <p className='text-lg font-semibold'>₱{Number(product.market_price).toLocaleString("en-PH")}</p>
                </div>
              </div>
              <div className='text-end text-sm text-nowrap w-full'>
                <p className={profit < 1 ? 'text-red-700 dark:text-red-500' : 'text-green-700 dark:text-green-500'}>
                  {profit < 0 ? 'Loss' : 'Gain'} : <strong>₱ {Number(profit).toLocaleString("en-PH")}</strong>
                </p>
              </div>
            </section>

            <Accordion type="single" collapsible className="w-full !px-0 !py-0">
              <AccordionItem value="item-1" className='px-4'>
                {
                  price_history.length > 0 &&
                  <section className="flex flex-col">
                    <AccordionTrigger>
                      <div className='font-semibold flex items-start gap-1'>
                        <p>Price History</p>
                        <span className='text-xs'>{price_history_count > 0 ? price_history_count : null}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>

                      <div className='*:p-5 *:text-gray-700 *:dark:text-gray-300 border *:hover:bg-gray-50 *:dark:hover:bg-accent rounded-lg  overflow-y-auto overflow-x-hidden max-h-60'>
                        {
                          price_history.map(price => (
                            <Dialog>
                              <DialogTrigger asChild>
                                <div key={price.id} className="flex md:flex-row flex-col w-full md:justify-between md:items-start md:gap-2 py-2 cursor-pointer" >
                                  <section className='flex items-start gap-1'>
                                    <div>
                                      <p className='font-semibold text-lg'>{`₱${Number(price.new_selling_price).toLocaleString("en-PH")}`}</p>
                                      <p className='text-sm truncate line-through'>{`₱${Number(price.old_selling_price).toLocaleString("en-PH")}`} - Old Selling Price</p>
                                    </div>
                                  </section>
                                  <section className="font-medium text-xs text-end space-y-2">
                                    {/* <h1 className='text-sm text-black dark:text-white md:block hidden'><span className='text-gray-500'>Updated by:</span> {price.user.name}</h1> */}
                                    <p>@ {dayjs(price.created_at).format("MMM DD, YYYY")}</p>
                                  </section>
                                </div>
                              </DialogTrigger>

                              <DialogContent>
                                <DialogTitle>Price Details</DialogTitle>
                                <PriceHistory price={price} />
                              </DialogContent>
                            </Dialog>
                          ))
                        }
                      </div>
                    </AccordionContent>

                  </section>
                }

              </AccordionItem>
              <AccordionItem value="item-2" className='px-4'>
                <AccordionTrigger>
                  <div className='font-semibold flex items-start gap-1'>
                    <p>Sold History</p>
                    <span className='text-xs'>{product_sold > 0 ? product_sold : null}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  TBD
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className='px-4'>
                <section className="flex flex-col">
                  <AccordionTrigger><h1 className='font-semibold'>More Details</h1></AccordionTrigger>
                  <AccordionContent>
                    <div className='*:p-5 *:text-gray-700 *:dark:text-gray-300 border *:hover:bg-gray-50 *:dark:hover:bg-black rounded-lg overflow-hidden'>
                      <MoreDetails label="Product ID" value={product.id} />
                      <MoreDetails label="Expiration Date" value={product.expiration_date
                        ? dayjs(product.expiration_date).format("MMM DD, YYYY")
                        : "N/A"} />
                      <MoreDetails label="Product Added" value={dayjs(product.created_at).format('MMM DD, YYYY | hh:mm a')} />
                      <MoreDetails label="Last Update" value={dayjs(product.updated_at).format('MMM DD, YYYY | hh:mm a')} />
                    </div>
                  </AccordionContent>
                </section>
              </AccordionItem>
            </Accordion>
          </div>

        </section>
      </div>
    </AppLayout>
  );
}
