import { useState, useMemo, useCallback } from "react";
import AppLayout from '@/layouts/app-layout';
import { Product, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  ColumnDef, useReactTable, getCoreRowModel, flexRender,
  getPaginationRowModel
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus, Eye, Edit3, Trash2, X, LucideInfo } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import dayjs from "dayjs";
import PosInfo from "@/components/pos-info";

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inventory', href: '/admin/inventory' },
];

export default function Index({ products, inventory_count }: { products: Product[]; inventory_count: number; }) {
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
    router.delete(route("inventory.destroy", { id }));
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
            className="w-16 h-16 object-cover rounded-md bg-white"
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
          <strong>₱{Number(row.original.selling_price).toLocaleString("en-PH")}</strong>
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
              <Link href={route('inventory.show', row.original.id)}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 text-black dark:text-white" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>View</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={route('inventory.edit', row.original.id)}>
                <Button variant="default" size="sm">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>

          {/* <Tooltip>
            <Dialog>
              <TooltipTrigger asChild>
                <DialogTrigger>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
              <DialogContent>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                  Are you sure you want to delete '<strong>{row.original.name}</strong>' ?
                </DialogDescription>
                <DialogFooter className="flex w-full justify-end gap-3">
                  <DialogClose asChild>
                    <Button type="button" size="sm" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button variant="destructive" type="submit" size="sm" onClick={() => handleDelete(row.original.id)}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Tooltip> */}
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
        {products.length ? (
          <>
            <section className="flex justify-between items-end gap-4">
              <div className="text-2xl font-semibold flex items-start gap-1">
                <p>Products</p>
                <span className="text-sm">{inventory_count}</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <LucideInfo className="w-6 h-6 cursor-pointer hover:opacity-70" />
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Product Information</DialogTitle>
                  <PosInfo />
                </DialogContent>
              </Dialog>
            </section>

            <section className="flex justify-between">
              <div className="flex relative justify-start items-center gap-5">
                <Input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={handleSearch}
                  className="md:w-80 w-60"
                />
                {search && (
                  <X
                    className="absolute right-3 text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => setSearch("")}
                    size={20}
                  />
                )}
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
                        className={`${row.original.stock <= 5
                          ? "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950 hover:bg-red-200 dark:hover:bg-red-950/80 border-t border-red-500"
                          : row.original.expiration_date === null || row.original.expiration_date === undefined
                            ? ""
                            : new Date(row.original.expiration_date) < new Date()
                              ? "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950 hover:bg-yellow-100 dark:hover:bg-yellow-950/80 border-t border-yellow-500"
                              : ""
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
                      <TableCell colSpan={columns.length} className="text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TooltipProvider>

            <div className="flex justify-between items-center p-3">
              <div>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-40 items-center flex flex-col gap-3 justify-center">
            <p className="text-center md:text-2xl text-lg">No results found</p>
            <Link href={route("inventory.create")}>
              <Button variant="default" size="default">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </div>
        )}

      </div>
    </AppLayout >
  );
}
