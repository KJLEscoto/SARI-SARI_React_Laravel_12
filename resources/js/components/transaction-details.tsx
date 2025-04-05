import { Transaction } from '@/types';
import { MoreDetails } from './more-details';
import dayjs from 'dayjs';
import { Link } from '@inertiajs/react';


export default function TransactionDetails({ transaction, order_items, payment_method }: { transaction: any; order_items: any[]; payment_method: string }) {

  console.log(transaction);

  return (
    <div className='*:py-3 *:px-4 border rounded-lg *:hover:bg-gray-50 *:dark:hover:bg-black overflow-hidden'>
      <MoreDetails label="Date" value={dayjs(transaction.created_at).format("MMM DD, YYYY | h:mm a")} />
      <MoreDetails label="Handled by" value={transaction.user?.name} />

      {
        transaction.type === "paid" || transaction.type === "pending" ?
          <>
            <section className='max-h-60 overflow-auto !p-0 border-y'>
              {order_items?.length > 0 ? (
                order_items.map((item) => (
                  <li className='grid grid-cols-3 p-3 hover:bg-gray-100 dark:hover:bg-accent'>
                    <Link href={route('inventory.show', item.product.id)} className='flex items-start w-full gap-2 group'>
                      <img draggable="false" className="w-12 h-12 object-cover rounded-sm group-hover:scale-105 transition" src={item.product.image ? `/storage/${item.product.image}` : "/images/no_image.jpeg"} />
                      <section className='w-full text-start'>
                        <p className='truncate font-medium text-sm group-hover:underline'>{item.product.name}</p>
                        <p className='text-[12px]'>₱{item.bought_selling_price.toLocaleString("en-PH")}</p>
                      </section>
                    </Link>
                    <div className='w-full text-center self-center'>x {item.quantity}</div>
                    <div className='w-full text-end text-nowrap self-center'>₱{(Number(item.bought_selling_price) * item.quantity).toLocaleString("en-PH")}</div>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500 px-4 py-3">No order items found for this transaction.</p>
              )}
            </section>
            <MoreDetails label="Payment method" value={payment_method} />
          </>
          : null
      }

      <MoreDetails old_balance label="Old balance" value={`₱${Number(transaction.old_balance).toLocaleString('en-PH')}`} />
      <MoreDetails
        status={transaction.type}
        label={transaction.message}
        value={`${transaction.type === "borrow" || transaction.type === "pending" ? "+" : transaction.type === "paid" ? "" : "-"} ₱${Number(transaction.amount).toLocaleString('en-PH')}`}
      />


      <MoreDetails highlight label="Updated Balance" value={`₱${Number(transaction.updated_balance).toLocaleString('en-PH')}`} />
    </div>
  );
}