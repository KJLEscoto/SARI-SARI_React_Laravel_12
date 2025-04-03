import { Transaction } from '@/types';
import { MoreDetails } from './more-details';
import dayjs from 'dayjs';


export default function ShowBalance({ transaction }: { transaction: Transaction }) {
  return (
    <div className='*:py-3 *:px-4 border rounded-lg *:hover:bg-gray-50 overflow-hidden'>
      {/* <MoreDetails label="Transaction ID" value={transaction.id} /> */}
      <MoreDetails label="Date" value={dayjs(transaction.created_at).format("MMM DD, YYYY")} />

      <MoreDetails old_balance label="Old Balance" value={`₱${Number(transaction.old_balance).toLocaleString('en-PH')}`} />
      <MoreDetails
        label=""
        value={transaction.type === "borrow" || transaction.type === "pending" ? "+" : "-"}
      />
      <MoreDetails label={transaction.message} value={`₱${Number(transaction.amount).toLocaleString('en-PH')}`} />
      <MoreDetails highlight label="Updated Balance" value={`₱${Number(transaction.updated_balance).toLocaleString('en-PH')}`} />
    </div>
  );
}