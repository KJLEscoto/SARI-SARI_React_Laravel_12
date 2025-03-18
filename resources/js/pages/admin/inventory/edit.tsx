import AppLayout from '@/layouts/app-layout';
import { Product, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import dayjs from 'dayjs';
import { X, Save } from "lucide-react";


export default function Edit({ product }: { product: Product }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '/admin/inventory' },
    { title: product.name, href: `/admin/inventory/${product.id}` },
    { title: 'Edit Product', href: '/admin/inventory/edit' },
  ];

  const [name, setName] = useState<string>(product.name);
  const [category, setCategory] = useState<string>(product.category);
  const [stock, setStock] = useState<number>(product.stock);
  const [market_price, setMarketPrice] = useState<number>(product.market_price);
  const [selling_price, setSellingPrice] = useState<number>(product.selling_price);
  const [expiration_date, setExpirationDate] = useState<string | null>(
    product.expiration_date ? dayjs(product.expiration_date).format('YYYY-MM-DD') : null
  );
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const { errors } = usePage().props;

  // Monitor input changes
  useEffect(() => {
    setIsFormChanged(
      name !== product.name ||
      category !== product.category ||
      stock !== product.stock ||
      market_price !== product.market_price ||
      selling_price !== product.selling_price ||
      expiration_date !== (product.expiration_date ? dayjs(product.expiration_date).format('YYYY-MM-DD') : null) ||
      image !== null
    );
  }, [name, category, stock, market_price, selling_price, expiration_date, image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    // Revoke old object URL to prevent memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(file);
      setImagePreview(previewUrl);
    } else {
      setImage(null);
      setImagePreview(null); // Ensure preview is removed if canceled
    }
  };

  const updateProduct: FormEventHandler = (e) => {
    e.preventDefault();
    router.post(route('inventory.update', { id: product.id }), {
      _method: 'PUT',
      name,
      category,
      stock,
      market_price,
      selling_price,
      expiration_date,
      image
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Product | Inventory" />
      <main className="flex flex-col gap-4 p-4">
        <form className='flex flex-col gap-5' onSubmit={updateProduct}>

          <section className='w-full flex justify-between items-center'>
            <h1 className="text-2xl font-semibold">Edit Product</h1>

            <div className="flex justify-end gap-3 col-span-2">
              <Link href={route('inventory.show', { id: product.id })}>
                <Button variant="outline" type="button">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isFormChanged}>
                Save Changes
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </section>

          <div className='grid grid-cols-3 gap-5'>
            <section className="space-y-1">
              <Label htmlFor="name"> Product Name</Label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <InputError message={errors.name} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="category">Category</Label>
              <Input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
              <InputError message={errors.category} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input id="stock" type="number" placeholder='0' value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
              <InputError message={errors.stock} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="market_price">Market Price</Label>
              <Input id="market_price" type="number" placeholder='0.00' step='0.01' value={market_price} onChange={(e) => setMarketPrice(Number(e.target.value))} required />
              <InputError message={errors.market_price} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="selling_price">Selling Price</Label>
              <Input id="selling_price" type="number" placeholder='0.00' step='0.01' value={selling_price} onChange={(e) => setSellingPrice(Number(e.target.value))} required />
              <InputError message={errors.selling_price} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="expiration_date">Expiration Date</Label>
              <Input
                id="expiration_date"
                type="date"
                value={expiration_date || ""}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
              <InputError message={errors.expiration_date} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" onChange={handleFileChange} />
              <InputError message={errors.image} />
            </section>

            {(product.image || imagePreview) && (
              <section className="space-y-1">
                <Label>Image Preview</Label>
                <div className="flex gap-3">
                  {product.image && (
                    <img
                      src={`/storage/${product.image}`}
                      alt={`${product.name} image`}
                      className={`w-fit h-fit rounded-md transition-opacity duration-300 ${image ? 'opacity-30' : 'opacity-100'}`}
                    />
                  )}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="New Product Image"
                      className="w-fit h-fit rounded-md"
                    />
                  )}
                </div>
              </section>
            )}
          </div>
        </form>
      </main>
    </AppLayout>
  );
}

