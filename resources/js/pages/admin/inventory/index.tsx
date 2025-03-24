import { useState, useMemo, useCallback, useEffect } from "react";
import AppLayout from '@/layouts/app-layout';
import { Flash, Product, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  ColumnDef, useReactTable, getCoreRowModel, flexRender,
  getPaginationRowModel
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus, Eye, Edit3, Trash2, X } from "lucide-react";
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

export default function Index({ products, inventory_count }: { products: Product[]; inventory_count: number; }) {
  // Search State
  const [search, setSearch] = useState("");
  const { flash } = usePage<{ flash: Flash }>().props;

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    else if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);

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

          <Tooltip>
            <Dialog>
              <TooltipTrigger asChild>
                <DialogTrigger>
                  {/* <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}> */}
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
                    <Button type="button" size="sm" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button variant="destructive" type="submit" size="sm" onClick={() => handleDelete(row.original.id)}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
        <section className="flex justify-between gap-4">
          <h1 className="text-2xl font-semibold relative w-fit">Products <span className="absolute -right-4 top-0 text-sm">{inventory_count}</span></h1>
          <div className="flex gap-5">
            <section className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 dark:bg-red-950 border border-red-500 shadow"></div>
              <p className="text-sm">Low Stock</p>
            </section>
            <section className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-950 border border-yellow-500 shadow"></div>
              <p className="text-sm">Expired</p>
            </section>
          </div>
        </section>

        <section className="flex justify-between">
          <div className="flex relative justify-start items-center gap-5">
            <Input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={handleSearch}
              className="w-80"
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
