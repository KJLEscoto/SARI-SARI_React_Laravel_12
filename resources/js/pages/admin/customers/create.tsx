import AppLayout from '@/layouts/app-layout';
import { Customer, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import dayjs from 'dayjs';
import { X, Save, Plus } from "lucide-react";

type CustomerForm = {
  name: string;
  phone: string;
  address: string;
  image?: File | null;
}

export default function Create() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Customers', href: '/admin/customers' },
    { title: 'Add Customer', href: '/admin/customers/create' },
  ];

  const { data, setData, post, processing, errors, reset } = useForm<CustomerForm>({
    name: '',
    phone: '',
    address: 'Davao City',
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

  const createCustomer: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('customers.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Customer | Customers" />
      <main className="flex flex-col gap-4 p-4">
        <form className='flex flex-col gap-5' onSubmit={createCustomer}>

          <section className='w-full flex flex-wrap gap-3 justify-between items-center'>
            <h1 className="text-2xl font-semibold text-nowrap">Add Customer</h1>

            <div className="flex justify-end gap-3 col-span-2">
              <Link href={route('customers.index')}>
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
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
              <InputError message={errors.name} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} required />
              <InputError message={errors.phone} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input id="address" type="text" value={data.address} onChange={(e) => setData('address', e.target.value)} required />
              <InputError message={errors.address} />
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