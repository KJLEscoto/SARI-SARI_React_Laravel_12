import { Transaction } from '@/types';
import { MoreDetails } from './more-details';
import dayjs from 'dayjs';
import { Link, useForm } from '@inertiajs/react';
import { Checkbox } from './ui/checkbox';
import { FormEventHandler, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';

export default function TransactionDetails({ transaction, order_items, payment_method }: { transaction: any; order_items: any[]; payment_method: string }) {
  const { data, setData, post, processing } = useForm({
    status: transaction.status,
    _method: 'patch',
  });

  const submit: FormEventHandler = (e) => {
    // e.preventDefault();
    post(route('update_transaction_status', { id: transaction.id }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setData('status', 'paid'); // post() will now wait
    }
  };

  // ✅ Submit only when status is updated to 'paid'
  useEffect(() => {
    if (data.status === 'paid' && transaction.status !== 'paid') {
      post(route('update_transaction_status', { id: transaction.id }));
    }
  }, [data.status]);

  return (
    <form onSubmit={submit} className="*:py-3 *:px-4 border rounded-lg *:hover:bg-gray-50 *:dark:hover:bg-black overflow-hidden">
      <MoreDetails label="Date" value={dayjs(transaction.created_at).format("MMM DD, YYYY")} />
      <MoreDetails label="Handled by" value={transaction.user?.name} />

      {transaction.type === "order" && (
        <>
          <section className="max-h-60 overflow-auto !p-0 border-y">
            {order_items?.length > 0 ? (
              order_items.map((item) => (
                <li key={item.id} className="grid grid-cols-3 p-3 hover:bg-gray-100 dark:hover:bg-accent">
                  <Link href={route('inventory.show', item.product.id)} className="flex items-start w-full gap-2 group">
                    <img
                      draggable="false"
                      className="w-12 h-12 object-cover rounded-sm group-hover:scale-105 transition"
                      src={item.product.image ? `/storage/${item.product.image}` : "/images/no_image.jpeg"}
                      alt={item.product.name}
                    />
                    <section className="w-full text-start">
                      <p className="truncate font-medium text-sm group-hover:underline">{item.product.name}</p>
                      <p className="text-[12px]">₱{item.bought_selling_price.toLocaleString("en-PH")}</p>
                    </section>
                  </Link>
                  <div className="w-full text-end self-center">x {item.quantity}</div>
                  <div className="w-full text-end text-nowrap self-center">
                    ₱{(Number(item.bought_selling_price) * item.quantity).toLocaleString("en-PH")}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 px-4 py-3 flex items-center gap-1"><LoaderCircle className='w-4 h-4 animate-spin' /> Loading... (if it takes too long, close this panel)</p>
            )}
          </section>
          <MoreDetails label="Payment method" value={payment_method} />
        </>
      )}

      <MoreDetails old_balance label="Old balance" value={`₱${Number(transaction.old_balance).toLocaleString('en-PH')}`} />
      <MoreDetails
        status={transaction.status}
        label={transaction.message}
        value={`${(transaction.type === "order" && transaction.status === "pending") || transaction.type === "borrow" ? "+" : transaction.type === "pay" ? "-" : ""} ₱${Number(transaction.amount).toLocaleString('en-PH')}`}
      />
      <MoreDetails highlight label="Updated Balance" value={`₱${Number(transaction.updated_balance).toLocaleString('en-PH')}`} />

      {
        transaction.status != "paid" &&
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Check if Paid</p>
          <Checkbox
            id="paid"
            name="paid"
            className="cursor-pointer border-2"
            disabled={data.status === 'paid' || processing}
            checked={data.status === 'paid'}
            onCheckedChange={handleCheckboxChange}
          />
        </div>
      }

      <button type="submit" className="hidden">Submit</button>
    </form>
  );
}
