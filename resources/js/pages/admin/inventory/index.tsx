import { useState, useMemo, useCallback, useEffect } from "react";
import AppLayout from '@/layouts/app-layout';
import { Product, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  ColumnDef, useReactTable, getCoreRowModel, flexRender,
  getPaginationRowModel
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus, Eye, Edit3, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from "sonner";
import dayjs from "dayjs";

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inventory', href: '/inventory' },
];

export default function Index({ products, inventory_count }: { products: Product[]; inventory_count: number }) {
  // Search State
  const [search, setSearch] = useState("");

  // Memoized Search Filtering
  const filteredProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort latest first
      .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  // delete product
  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    router.delete(route("inventory.destroy", { id }), {
      onSuccess: () => {
        toast.success("Product deleted successfully!");
      },
      onError: () => {
        toast.error("Failed to delete product.");
      },
    });
  };

  // Define Table Columns
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.original.image
          ? `/storage/${row.original.image}`
          : "/images/no_image.jpeg";

        return (
          <img
            src={imageUrl}
            alt={`${row.original.name} image`}
            className="w-16 h-16 object-cover rounded-md"
            onError={(e) => (e.currentTarget.src = "/images/no_image.jpeg")} // Handle broken images
          />
        );
      },
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "stock", header: "Stock" },
    {
      accessorKey: "selling_price",
      header: "Selling Price",
      cell: ({ row }) => {
        return (
          <strong>₱{row.original.selling_price}</strong>
        )
      },
    },
    {
      accessorKey: "expiration_date",
      header: "Expiration Date",
      cell: ({ row }) =>
        row.original.expiration_date
          ? dayjs(row.original.expiration_date).format('MMM DD, YYYY')
          : "N/A",

    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center w-full">Actions</div>,
      cell: ({ row }) => (
        <div className='flex items-center justify-center gap-1.5'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={route('inventory.show', { id: row.original.id })}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>View</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size="sm">
                <Edit3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Create Table Instance with Pagination
  const table = useReactTable({
    data: filteredProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    table.setPageIndex(0);
  }, [table]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inventory" />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-semibold relative w-fit">Products <span className="absolute -right-6 top-0 text-sm">{inventory_count}</span></h1>

        <section className="flex justify-between">
          <div className="flex justify-start items-center gap-5">
            <Input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={handleSearch}
              className="w-80"
            />
          </div>
          <Link href={route("inventory.create")}>
            <Button variant="default" size="default">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </section>
        <TooltipProvider>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    className={`${row.original.stock <= 0 ? "bg-red-100 hover:bg-red-200" : ""
                      }`}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">No results found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TooltipProvider>

        <div className="flex justify-between items-center p-3">
          <div>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout >
  );
}
