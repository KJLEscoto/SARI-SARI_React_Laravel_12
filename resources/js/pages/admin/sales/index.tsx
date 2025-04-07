import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sales',
    href: '/admin/sales',
  },
];

export default function Index({ sales }: { sales: any[] }) {
  const getInitials = useInitials();

  console.log(sales);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sales" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {
          sales.map((sale) => (
            <div className=""
              key={sale.id}>
              {sale.customer.name}
              {sale.total_amount}

              {
                sale.customer.image ?
                  <img src={sale.customer.image ? `/storage/${sale.customer.image}` : "/images/no_user.jpg"} alt={`${sale.customer.name} image`} className="w-14 h-14 rounded-full object-cover" onError={(e) => (e.currentTarget.src = "/images/no_user.jpg")} />
                  :
                  <div>
                    <div className="w-14 h-14 object-cover rounded-full flex items-center justify-center bg-black/70 dark:bg-[#404040] text-lg text-white">
                      {getInitials(sale.customer.name)}
                    </div>
                  </div>
              }
            </div>))
        }
      </div>
    </AppLayout>
  );
}
