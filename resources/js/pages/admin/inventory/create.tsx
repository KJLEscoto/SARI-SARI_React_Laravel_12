import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import InputError from '@/components/input-error';
import { X, Plus } from "lucide-react";

type ProductForm = {
  name: string;
  // category: string;
  stock: number | string;
  selling_price: number | string;
  market_price: number | string;
  expiration_date?: string | null;
  image?: File | null;
}

export default function Create() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '/admin/inventory' },
    { title: 'Add Product', href: '/admin/inventory/create' },
  ];

  const { data, setData, post, processing, errors, reset } = useForm<ProductForm>({
    name: '',
    // category: '',
    stock: '',
    selling_price: '',
    market_price: '',
    expiration_date: null,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    // Revoke old object URL to avoid memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setData("image", file);
    } else {
      setImagePreview(null);
      setData("image", null);
    }
  };

  const createProduct: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('inventory.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Product | Inventory" />
      <main className="flex flex-col gap-4 p-4">
        <form className='flex flex-col gap-5' onSubmit={createProduct}>

          <section className='w-full flex flex-wrap gap-3 justify-between items-center'>
            <h1 className="text-2xl font-semibold text-nowrap">Add Product</h1>

            <div className="flex justify-end gap-3 col-span-2">
              <Link href={route('inventory.index')}>
                <Button variant="outline" type="button">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={processing}>
                Submit
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </section>

          <div className='grid md:grid-cols-3 grid-cols-1 gap-5'>
            <section className="space-y-1">
              <Label htmlFor="name"> Product Name</Label>
              <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
              <InputError message={errors.name} />
            </section>

            {/* <section className="space-y-1">
              <Label htmlFor="name">Category</Label>
              <Input id="category" type="text" value={data.category} onChange={(e) => setData('category', e.target.value)} required />
              <InputError message={errors.category} />
            </section> */}

            <section className="space-y-1">
              <Label htmlFor="market_price">Market Price</Label>
              <Input id="market_price" type="number" placeholder='0.00' step='0.01' value={data.market_price} onChange={(e) => setData('market_price', Number(e.target.value))} required />
              <InputError message={errors.market_price} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="selling_price">Selling Price</Label>
              <Input id="selling_price" type="number" placeholder='0.00' step='0.01' value={data.selling_price} onChange={(e) => setData('selling_price', Number(e.target.value))} required />
              <InputError message={errors.selling_price} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input id="stock" type="number" placeholder='0' value={data.stock} onChange={(e) => setData('stock', Number(e.target.value))} required />
              <InputError message={errors.stock} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="expiration_date">Expiration Date</Label>
              <Input
                id="expiration_date"
                type="date"
                value={data.expiration_date || ""}
                min={new Date(new Date().setDate(new Date().getDate() + 1))
                  .toISOString()
                  .split("T")[0]}
                onChange={(e) => setData("expiration_date", e.target.value)}
              />
              <InputError message={errors.expiration_date} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" onChange={handleFileChange} />
              <InputError message={errors.image} />
            </section>

            {imagePreview && (
              <section className="space-y-1">
                <Label htmlFor="image">Image Preview</Label>
                <img
                  src={imagePreview}
                  alt="Product Image"
                  className="w-fit h-fit rounded-md"
                />
              </section>
            )}

          </div>
        </form>
      </main>
    </AppLayout>
  );
}
