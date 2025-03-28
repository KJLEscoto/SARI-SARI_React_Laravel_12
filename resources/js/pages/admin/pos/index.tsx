import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Product, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, ChevronRight } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Point of Sales',
    href: '/admin/pos',
  },
];

const isExpired = (expirationDate: string) => {
  return new Date(expirationDate) < new Date();
};

export default function Index({ products }: { products: Product[] }) {
  const [selectedProducts, setSelectedProducts] = useState<{ product: Product; quantity: number }[]>([]);

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
          quantity,
          sub_total: Number(product.selling_price) * quantity,
        })),
        total_amount: totalAmount,
        payment_method: "cash",
        status: "paid",
        customer_id: 1,
        user_id: 1,
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


  const totalAmount = selectedProducts.reduce((total, { product, quantity }) => total + Number(product.selling_price) * quantity, 0);

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

              let borderColor = "";
              if (expired) borderColor = "border-yellow-500 hover:border-yellow-600 dark:hover:border-yellow-600";
              if (lowStock) borderColor = "border-red-500 hover:border-red-600 dark:hover:border-red-600";
              if (expired && lowStock) borderColor = "border-red-500 hover:border-red-600 dark:hover:border-red-600";

              // Get the selected quantity for this product
              const selectedQuantity = selectedProducts.find((p) => p.product.id === product.id)?.quantity || 0;
              const isOutOfStock = product.stock - selectedQuantity <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && handleProductClick(product)}
                  className={`p-4 select-none border rounded-lg hover:shadow-md cursor-pointer dark:hover:border-white transition hover:border-black/50 bg-white dark:bg-[#171717] group ${borderColor} ${isOutOfStock ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="w-full h-40 overflow-hidden rounded-t-md">
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
          <div className="flex justify-between">
            <div className="space-y-2">
              <h1 className="font-semibold">Orders</h1>
              <p>{selectedProducts.length} item(s)</p>
            </div>

            <div>
              <section className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-200 dark:bg-red-950 border border-red-500 shadow"></div>
                <p className="text-sm">Low Stock</p>
              </section>
              <section className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-950 border border-yellow-500 shadow"></div>
                <p className="text-sm">Expired</p>
              </section>
            </div>
          </div>

          <Separator />

          {/* Display selected products */}
          <div className="h-full overflow-auto divide-y">
            {selectedProducts.length > 0 ? (
              selectedProducts.map(({ product, quantity }) => (
                <div key={product.id} className="grid grid-cols-3 py-2 px-3">
                  <section className='flex flex-col justify-start'>
                    <p className="text-sm font-semibold">{product.name}</p>
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
                <DialogDescription>
                  Your Orders:
                </DialogDescription>
                <form className="space-y-6" onSubmit={handlePurchase}>
                  <div>
                    orders summary here.
                  </div>

                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button variant="default" size="default" type='submit'>
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
