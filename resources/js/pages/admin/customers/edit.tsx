import AppLayout from '@/layouts/app-layout';
import { Customer, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import dayjs from 'dayjs';
import { X, Save } from "lucide-react";


export default function Edit({ customer }: { customer: Customer }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Customers', href: '/admin/customers' },
    { title: customer.name, href: `/admin/customers/${customer.id}` },
    { title: 'Edit Customer', href: '/admin/customers/edit' },
  ];

  const [name, setName] = useState<string>(customer.name);
  const [phone, setPhone] = useState<string>(customer.phone);
  const [address, setAddress] = useState<string>(customer.address);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const { errors } = usePage().props;

  // Monitor input changes
  useEffect(() => {
    setIsFormChanged(
      name !== customer.name ||
      phone !== customer.phone ||
      address !== customer.address ||
      image !== null
    );
  }, [name, phone, address, image]);

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

  const updateCustomer: FormEventHandler = (e) => {
    e.preventDefault();
    router.post(route('customers.update', { id: customer.id }), {
      _method: 'PUT',
      name,
      phone,
      address,
      image
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Customer | Customers" />
      <main className="flex flex-col gap-4 p-4">
        <form className='flex flex-col gap-5' onSubmit={updateCustomer}>

          <section className='w-full flex flex-wrap gap-3 justify-between items-center'>
            <h1 className="text-2xl font-semibold text-nowrap">Edit Customer</h1>

            <div className="flex justify-end gap-3 col-span-2">
              <Link href={route('customers.show', { id: customer.id })}>
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

          <div className='grid md:grid-cols-3 grid-cols-1 gap-5'>
            <section className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <InputError message={errors.name} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <InputError message={errors.phone} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
              <InputError message={errors.address} />
            </section>

            <section className="space-y-1">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" onChange={handleFileChange} />
              <InputError message={errors.image} />
            </section>

            {(customer.image || imagePreview) && (
              <section className="space-y-1">
                <Label>Image Preview</Label>
                <div className="flex md:flex-row flex-col-reverse gap-3">
                  {customer.image && (
                    <img
                      src={`/storage/${customer.image}`}
                      alt={`${customer.name} image`}
                      className={`w-fit h-fit rounded-md transition-opacity duration-300 ${image ? 'opacity-30' : 'opacity-100'}`}
                    />
                  )}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="New Customer Image"
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

