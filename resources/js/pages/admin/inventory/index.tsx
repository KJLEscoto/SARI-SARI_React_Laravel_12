import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inventory',
    href: '/inventory',
  },
];

// ✅ Dummy product data with correct image paths
const products = [
  {
    id: 1,
    image: "/images/no_image.jpeg", // ✅ Correct path
    name: "Laptop",
    category: "Electronics",
    stock: 10,
    sellingPrice: "₱50,000",
    expirationDate: "N/A",
  },
  {
    id: 2,
    image: "/images/no_image.jpeg", // ✅ Correct path
    name: "Milk",
    category: "Dairy",
    stock: 30,
    sellingPrice: "₱80",
    expirationDate: "Sept 25, 2025",
  },
  {
    id: 3,
    image: "/images/no_image.jpeg", // ✅ Correct path
    name: "Shampoo",
    category: "Personal Care",
    stock: 20,
    sellingPrice: "₱150",
    expirationDate: "Sept 25, 2025",
  },
];

export default function Index() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inventory" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <h1 className="text-2xl font-semibold">{breadcrumbs[0].title}</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell><p className='px-3 py-1 text-xs dark:bg-gray-900 bg-gray-300 dark:text-white text-gray-700 font-medium w-fit rounded-full'>{product.category}</p></TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.sellingPrice}</TableCell>
                <TableCell>{product.expirationDate}</TableCell>
                <TableCell className="my-auto">
                  <div className='flex items-center justify-center gap-1.5'>
                    <Link href={route("inventory.show", { id: product.id })} prefetch>
                      <Button className='cursor-pointer' variant="outline" size="sm">View</Button>
                    </Link>
                    <Button className='cursor-pointer' variant="default" size="sm">Edit</Button>
                    <Button className='cursor-pointer' variant="destructive" size="sm">Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
