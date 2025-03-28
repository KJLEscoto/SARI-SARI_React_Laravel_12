import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Customer, Product, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, ChevronRight } from 'lucide-react';
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

              let bgColor = "";
              if (expired) bgColor = "!bg-yellow-100";
              if (lowStock) bgColor = "!bg-red-100";
              if (expired && lowStock) bgColor = "!bg-red-100";

              // Get the selected quantity for this product
              const selectedQuantity = selectedProducts.find((p) => p.product.id === product.id)?.quantity || 0;
              const isOutOfStock = product.stock - selectedQuantity <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && handleProductClick(product)}
                  className={`p-4 select-none border rounded-lg hover:shadow-md cursor-pointer dark:hover:border-white transition hover:border-black/50 bg-white dark:bg-[#171717] group ${bgColor} ${isOutOfStock ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="w-full h-40 overflow-hidden rounded-t-md border">
                    <img draggable="false" className="w-full h-full object-cover group-hover:scale-105 transition" src={product.image ? `/storage/${product.image}` : "/images/no_image.jpeg"} />
                  </div>
                  <div className="flex items-center font-semibold justify-between gap-3 mt-2 text-black dark:text-white">
                    <h2 className="text-lg w-1/2 truncate">{product.name}</h2>
                    <p className="text-xs font-normal text-nowrap">Stock: {product.stock - selectedQuantity}</p>
                  </div>
                  <h1 className="text-black dark:text-white">₱{Number(product.selling_price).toLocaleString("en-PH")}</h1>
                </div>
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
            <div className="space-y-2">
              <h1 className="font-semibold">Orders</h1>
              <p>{selectedProducts.length} item(s)</p>
            </div>

            <div className='flex flex-col-reverse gap-2 justify-end items-end'>
              <div className='flex gap-2'>
                <section className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-200 dark:bg-red-950 border border-red-500 shadow"></div>
                  <p className="text-sm">Low Stock</p>
                </section>
                <section className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-950 border border-yellow-500 shadow"></div>
                  <p className="text-sm">Expired</p>
                </section>
              </div>

              <div>
                <Button disabled={selectedProducts.length === 0} size="sm" variant='outline' onClick={resetOrder}>
                  Reset All
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Display selected products */}
          <div className="h-full overflow-auto divide-y">
            {selectedProducts.length > 0 ? (
              selectedProducts.map(({ product, quantity }) => (
                <div key={product.id} className="grid grid-cols-3 py-2 px-3">
                  <section className='flex flex-col justify-start'>
                    <p className="text-sm font-semibold truncate">{product.name}</p>
                    <p className="text-[12px]">₱{Number(product.selling_price).toLocaleString("en-PH")}</p>
                  </section>

                  <section className='flex items-center justify-center'>
                    {/* quantity here */}
                    <p className='text-sm'>x {quantity}</p>
                  </section>

                  <section className='flex gap-3 justify-end items-center'>
                    <Button onClick={() => updateQuantity(product.id, -1)} variant='default' className='bg-red-500 hover:bg-red-600'>
                      {/* quantity - 1 */}
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
              <p className="text-center text-black/50">No products selected</p>
            )}
          </div>

          <Separator />

          <div className='flex items-center justify-between gap-3'>
            <h1 className="font-semibold">
              Total: ₱{totalAmount.toLocaleString("en-PH")}
            </h1>

            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={selectedProducts.length === 0} variant="default" size="default">
                  Purchase
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Order Confirmation</DialogTitle>
                <form className="space-y-6" onSubmit={handlePurchase}>

                  <section className='space-y-2'>
                    <DialogDescription>
                      Select a customer below to confirm this order.
                    </DialogDescription>

                    <Select onValueChange={(value) => setSelectedCustomer(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-" />
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
                      <ul className="overflow-auto max-h-60 border-y py-1">
                        {selectedProducts.map(({ product, quantity }) => (
                          <li key={product.id} className="grid grid-cols-3 px-3 py-1 hover:bg-gray-100">
                            <div className='w-full text-start'>
                              <p className='truncate font-medium text-sm'>{product.name}</p>
                              <p className='text-[12px]'>₱{product.selling_price.toLocaleString("en-PH")}</p>
                            </div>
                            <div className='w-full text-center'>x {quantity}</div>
                            <div className='w-full text-end text-nowrap'>₱{(Number(product.selling_price) * quantity).toLocaleString("en-PH")}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 p-3">No products selected</p>
                    )}
                    <div className="flex justify-between font-semibold bg-black/80 text-white p-3">
                      <span>Total:</span>
                      <span>₱{totalAmount.toLocaleString("en-PH")}</span>
                    </div>
                  </section>

                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" onClick={cancelOrder}>
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button variant="default" size="default" type='submit' disabled={!selectedCustomer || !paymentMethod || !status}>
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
