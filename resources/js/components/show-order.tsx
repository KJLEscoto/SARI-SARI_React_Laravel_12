import { Product, Transaction } from '@/types';
import { MoreDetails } from './more-details';
import dayjs from 'dayjs';


export default function ShowOrder({ transaction, order_items }: { transaction: Transaction; order_items: any[] }) {
  return (
    <div className='*:py-3 *:px-4 border rounded-lg *:hover:bg-gray-50 overflow-hidden'>
      <MoreDetails label="Date" value={dayjs(transaction.created_at).format("MMM DD, YYYY")} />
      {/* <MoreDetails label="Transaction ID" value={transaction.id} /> */}

      <section className='max-h-60 overflow-auto !p-0 border-y'>
        {order_items?.length > 0 ? (
          order_items.map((item) => (
            <li className='grid grid-cols-3 p-3 hover:bg-gray-100 cursor-default'>
              <div className='flex items-start w-full gap-2'>
                <img draggable="false" className="w-12 h-12 object-cover rounded-sm" src={item.product.image ? `/storage/${item.product.image}` : "/images/no_image.jpeg"} />
                <section className='w-full text-start'>
                  <p className='truncate font-medium text-sm'>{item.product.name}</p>
                  <p className='text-[12px]'>₱{item.product.selling_price.toLocaleString("en-PH")}</p>
                </section>
              </div>
              <div className='w-full text-center self-center'>x {item.quantity}</div>
              <div className='w-full text-end text-nowrap self-center'>₱{(Number(item.product.selling_price) * item.quantity).toLocaleString("en-PH")}</div>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">No order items found for this transaction.</p>
        )}
      </section>

      <MoreDetails old_balance label="Old Balance" value={`₱${Number(transaction.old_balance).toLocaleString('en-PH')}`} />
      {
        transaction.type != "paid" &&
        <MoreDetails
          label=""
          value={transaction.type === "borrow" || transaction.type === "pending" ? "+" : "-"}
        />
      }
      <MoreDetails label={transaction.message} value={`₱${Number(transaction.amount).toLocaleString('en-PH')}`} />

      <MoreDetails highlight label="Updated Balance" value={`₱${Number(transaction.updated_balance).toLocaleString('en-PH')}`} />
    </div>
  );
}