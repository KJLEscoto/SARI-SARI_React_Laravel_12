import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Customer, Product, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, ChevronRight, LucideInfo } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';
import PosInfo from '@/components/pos-info';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Point of Sales',
    href: '/admin/pos',
  },
];

const isExpired = (expirationDate: string) => {
  return new Date(expirationDate) < new Date();
};

export default function Index({ products, cashier, customers }: { products: Product[]; cashier: number; customers: Customer[] }) {

  const [selectedProducts, setSelectedProducts] = useState<{ product: Product; quantity: number }[]>([]);

  const totalAmount = selectedProducts.reduce((total, { product, quantity }) => total + Number(product.selling_price) * quantity, 0);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [status, setStatus] = useState('');
  const [processing, setProcessing] = useState(false);


  const handleProductClick = (product: Product) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.product.id === product.id);
      return existingProduct
        ? prev.map((p) => (p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p))
        : [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setSelectedProducts((prev) =>
      prev
        .map((p) => (p.product.id === productId ? { ...p, quantity: p.quantity + delta } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const handlePurchase: FormEventHandler = (e) => {
    // e.preventDefault();
    setProcessing(true);
    router.post(route("pos.store"),
      {
        items: selectedProducts.map(({ product, quantity }) => ({
          product_id: product.id,
          quantity: quantity,
          sub_total: Number(product.selling_price) * quantity,
        })),
        total_amount: totalAmount,
        payment_method: paymentMethod,
        status: status,
        customer_id: selectedCustomer,
        user_id: cashier,
      },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setSelectedProducts([]);
          setProcessing(false);
        },
      }
    );
  };

  const cancelOrder = () => {
    setSelectedCustomer('');
    setPaymentMethod('');
    setStatus('');
  };

  const resetOrder = () => {
    setSelectedProducts([]);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="POS" />
      <div className="grid grid-cols-5 gap-4 rounded-xl p-4">
        {/* Products List */}
        <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full col-span-3">
          {products.length > 0 ? (
            products.map((product) => {
              const expired = isExpired(product.expiration_date || 'N/A');
              const lowStock = product.stock <= 5;

              // Get the selected quantity for this product
              const selectedQuantity = selectedProducts.find((p) => p.product.id === product.id)?.quantity || 0;
              const isOutOfStock = product.stock - selectedQuantity <= 0;

              return (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        key={product.id}
                        onClick={() => !isOutOfStock && handleProductClick(product)}
                        className={`p-4 select-none border h-fit rounded-lg hover:shadow-md cursor-pointer dark:hover:border-white transition hover:border-black/50 bg-white dark:bg-[#171717] group ${isOutOfStock ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <div className="w-full h-40 overflow-hidden rounded-t-md">
                          <img draggable="false" className="w-full bg-white h-full object-cover group-hover:scale-105 transition" src={product.image ? `/storage/${product.image}` : "/images/no_image.jpeg"} />
                        </div>
                        <div className="flex items-center font-semibold justify-between gap-3 mt-2 text-black dark:text-white">
                          <h2 className="text-lg w-1/2 truncate">{product.name}</h2>
                          <p className="text-xs font-normal text-nowrap">Stock: {product.stock - selectedQuantity}</p>
                        </div>
                        <div className='flex justify-between gap-3 items-center'>
                          <h1 className="text-black dark:text-white">₱{Number(product.selling_price).toLocaleString("en-PH")}</h1>
                          <div className='flex gap-2 items-center'>
                            {
                              lowStock &&
                              <div className="w-3 h-3 bg-red-200 dark:bg-red-950 border border-red-500 shadow"></div>
                            }
                            {
                              expired &&
                              <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-950 border border-yellow-500 shadow"></div>
                            }
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {product.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })
          ) : (
            <div className="w-full h-40 items-center flex flex-col gap-3 justify-center">
              <p className="text-center md:text-2xl text-lg">No products available</p>
              <Link href={route("inventory.create")}>
                <Button variant="default" size="default">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Clicked Products Section */}
        <section className="w-full sticky h-[calc(100vh-6rem)] overflow-hidden top-2 shadow-md bg-white dark:bg-[#171717] border rounded-md p-4 col-span-2 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <section className="space-y-2">
              <h1 className="font-semibold">Orders</h1>
              <p>{selectedProducts.length} item(s)</p>
            </section>

            <section className='flex flex-col gap-2 justify-end items-end'>
              <Dialog>
                <DialogTrigger asChild>
                  <LucideInfo className="w-4 h-4 cursor-pointer hover:opacity-70" />
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>POS Information</DialogTitle>
                  <PosInfo />
                </DialogContent>
              </Dialog>
              <div>
                <Button disabled={selectedProducts.length === 0} size="sm" variant='outline' onClick={resetOrder}>
                  Reset All
                </Button>
              </div>
            </section>
          </div>

          <Separator />

          {/* Display selected products */}
          <div className="h-full overflow-auto divide-y">
            {selectedProducts.length > 0 ? (
              selectedProducts.map(({ product, quantity }) => (
                <div key={product.id} className="grid grid-cols-5 py-2 px-3">
                  <div className="flex items-start gap-3 w-full col-span-2">
                    <div className="w-12 h-12 shrink-0">
                      <img
                        draggable="false"
                        src={product.image ? `/storage/${product.image}` : "/images/no_image.jpeg"}
                        alt={product.name || "Product Image"}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>

                    <section className="flex flex-col justify-start w-full overflow-hidden">
                      <p className="text-sm font-semibold truncate">{product.name}</p>
                      <p className="text-xs text-nowrap">₱{Number(product.selling_price).toLocaleString("en-PH")}</p>
                    </section>
                  </div>

                  <section className='flex items-center justify-center'>
                    <p className='text-sm'>x {quantity}</p>
                  </section>

                  <section className='flex gap-3 justify-end items-center col-span-2'>
                    <Button onClick={() => updateQuantity(product.id, -1)} variant='default' className='bg-red-500 hover:bg-red-600'>
                      <Minus className='w-3 h-3' />
                    </Button>
                    <Button
                      onClick={() => updateQuantity(product.id, 1)}
                      variant="default"
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={quantity >= product.stock} // Disable if quantity reaches stock
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </section>
                </div>
              ))
            ) : (
              <p className="text-center text-black/50 dark:text-white/50">No products selected</p>
            )}
          </div>

          <Separator />

          <div className='flex items-center justify-between gap-3'>
            <h1 className="font-semibold">
              Total: ₱{totalAmount.toLocaleString("en-PH")}
            </h1>

            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={selectedProducts.length === 0 || processing} variant="default" size="default">
                  Purchase
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Order Confirmation</DialogTitle>
                <form className="space-y-6" onSubmit={handlePurchase}>

                  <section className='space-y-2'>
                    <DialogDescription>
                      Complete this form to confirm the order.
                    </DialogDescription>

                    <Select value={selectedCustomer} onValueChange={(value) => setSelectedCustomer(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id.toString()}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </section>

                  <div className='flex gap-3'>
                    <section className='space-y-2 w-full'>
                      <DialogDescription>
                        Payment Method
                      </DialogDescription>

                      <RadioGroup
                        id='paymentMethod'
                        className='flex flex-col gap-2'
                        value={paymentMethod}
                        onValueChange={(value) => setPaymentMethod(value)} // Update state when value changes
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className='flex items-center gap-1 cursor-pointer'>
                            Cash
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="gcash" id="gcash" />
                          <Label htmlFor="gcash" className='flex items-center gap-1 cursor-pointer'>
                            Gcash
                          </Label>
                        </div>
                      </RadioGroup>
                    </section>

                    <section className='space-y-2 w-full'>
                      <DialogDescription>
                        Pay
                      </DialogDescription>

                      <RadioGroup
                        id='status'
                        className='flex flex-col gap-2'
                        value={status}
                        onValueChange={(value) => setStatus(value)} // Update state when value changes
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paid" id="now" />
                          <Label htmlFor="now" className='flex items-center gap-1 cursor-pointer'>
                            Now
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pending" id="later" />
                          <Label htmlFor="later" className='flex items-center gap-1 cursor-pointer'>
                            Later
                          </Label>
                        </div>
                      </RadioGroup>
                    </section>
                  </div>

                  <section className="border rounded-md overflow-hidden">
                    <div className='flex justify-between gap-2 items-end p-3'>
                      <h2 className="font-semibold">Order Summary</h2>
                      <p className='text-sm'>{selectedProducts.length} item(s)</p>
                    </div>
                    {selectedProducts.length > 0 ? (
                      <ul className="overflow-auto max-h-60 border-y">
                        {selectedProducts.map(({ product, quantity }) => (
                          <li key={product.id} className='grid grid-cols-3 p-3 hover:bg-gray-100 dark:hover:bg-accent cursor-default'>
                            <div className='flex items-start w-full gap-2'>
                              <img draggable="false" className="w-10 h-10 object-cover rounded-sm" src={product.image ? `/storage/${product.image}` : "/images/no_image.jpeg"} />

                              <section className='w-full text-start'>
                                <p className='truncate font-medium text-sm'>{product.name}</p>
                                <p className='text-[12px]'>₱{product.selling_price.toLocaleString("en-PH")}</p>
                              </section>
                            </div>
                            <div className='w-full text-center self-center'>x {quantity}</div>
                            <div className='w-full text-end text-nowrap self-center'>₱{(Number(product.selling_price) * quantity).toLocaleString("en-PH")}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-black/50 dark:text-white/50 p-3">No products selected</p>
                    )}
                    <div className="flex justify-between font-semibold bg-black/80 dark:bg-white/30 text-white p-3">
                      <span>Total:</span>
                      <span>₱{totalAmount.toLocaleString("en-PH")}</span>
                    </div>
                  </section>

                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button type='button' variant="outline" onClick={cancelOrder}>
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button variant="default" size="default" type='submit' disabled={!selectedCustomer || !paymentMethod || !status || processing}>
                      Confirm
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
