import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import InputError from '@/components/input-error';
import { toast } from 'sonner';

interface ProductFormData {
  name: string;
  category: string;
  stock: number;
  selling_price: number;
  market_price: number;
  expiration_date?: string | null;
  image?: File | null;
  [key: string]: unknown;
}

export default function Create() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '/admin/inventory' },
    { title: 'Add Product', href: '/admin/inventory/create' },
  ];

  const { data, setData, post, reset, errors, processing } = useForm<ProductFormData>({
    name: '',
    category: '',
    stock: '',
    selling_price: '',
    market_price: '',
    expiration_date: null,
    image: null,
  });

  const imageRef = useRef<HTMLInputElement>(null);

  const createProduct: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('inventory.store'), {
      onSuccess: () => {
        toast.success('Product added successfully!');

        // Manually reset form fields with empty strings for numbers
        setData({
          name: '',
          category: '',
          stock: '', // Reset to empty string
          selling_price: '', // Reset to empty string
          market_price: '', // Reset to empty string
          expiration_date: null,
          image: null,
        });

        // Clear file input manually
        if (imageRef.current) imageRef.current.value = '';
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Product | Inventory" />

      <main className="flex flex-col gap-4 p-4">
        <form
          onSubmit={createProduct}
          className="dark:bg-transparent bg-white p-6 rounded-lg border shadow grid lg:grid-cols-3 grid-cols-1 gap-4"
        >
          <h1 className="text-2xl font-semibold">Add Product</h1>

          <div className="flex justify-end gap-3 col-span-2">
            <Link href={route('inventory.index')}>
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={processing}>Add Product</Button>
          </div>

          {/* Product Name */}
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" type="text" value={data.name} onChange={e => setData('name', e.target.value)} required />
            <InputError message={errors.name} />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" type="text" value={data.category} onChange={e => setData('category', e.target.value)} required />
            <InputError message={errors.category} />
          </div>

          {/* Stock Quantity */}
          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              value={data.stock}
              onChange={e => setData('stock', Number(e.target.value))}
              required
            />
            <InputError message={errors.stock} />
          </div>

          {/* Market Price */}
          <div>
            <Label htmlFor="market_price">Market Price (SRP)</Label>
            <Input
              id="market_price"
              type="number"
              placeholder="0.00"
              step="0.01"
              value={data.market_price}
              onChange={e => setData('market_price', Number(e.target.value))}
              required
            />
            <InputError message={errors.market_price} />
          </div>

          {/* Selling Price */}
          <div>
            <Label htmlFor="selling_price">Selling Price</Label>
            <Input
              id="selling_price"
              type="number"
              placeholder="0.00"
              step="0.01"
              value={data.selling_price}
              onChange={e => setData('selling_price', Number(e.target.value))}
              required
            />
            <InputError message={errors.selling_price} />
          </div>

          {/* Expiration Date */}
          <div>
            <Label htmlFor="expiration_date">Expiration Date (if available)</Label>
            <Input
              id="expiration_date"
              type="date"
              value={data.expiration_date ?? ''}
              onChange={e => setData('expiration_date', e.target.value || null)}
            />
            <InputError message={errors.expiration_date} />
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Image (Optional)</Label>
            <Input
              id="image"
              type="file"
              ref={imageRef}
              onChange={e => setData('image', e.target.files?.[0] ?? null)}
            />
            <InputError message={errors.image} />
          </div>

          {/* image preview */}
          {data.image && (
            <div className="cols-span-2">
              <Label>Image Preview</Label>
              <img
                src={URL.createObjectURL(data.image)}
                alt="Product Image"
                className="object-cover rounded-lg shadow-lg h-60"
              />
            </div>
          )}
        </form>
      </main>
    </AppLayout>
  );
}
