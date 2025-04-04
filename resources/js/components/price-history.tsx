import { MoreDetails } from './more-details';
import dayjs from 'dayjs';
import { Separator } from './ui/separator';

export default function PriceHistory({ price }: { price: any }) {
  return (
    <div>
      <div className='*:py-3 *:px-4 border rounded-lg *:hover:bg-gray-50 overflow-hidden'>
        <MoreDetails label="Date" value={dayjs(price.created_at).format("MMM DD, YYYY | h:mm a")} />
        <MoreDetails highlight label="Updated By" value={price.user.name} />

        <span className='!px-0 !py-0'>
          <div className='flex items-center *:py-3 *:px-4'>
            <MoreDetails status='paid' label="New Selling Price" value={`₱${Number(price.new_selling_price).toLocaleString('en-PH')}`} />
            <MoreDetails old_balance label="Old Selling Price" value={`₱${Number(price.old_selling_price).toLocaleString('en-PH')}`} />
          </div>
        </span>

        <span className='!px-0 !py-0'>
          <div className='flex items-center *:py-3 *:px-4'>
            <MoreDetails status='paid' label="New Market Price" value={`₱${Number(price.new_market_price).toLocaleString('en-PH')}`} />
            <MoreDetails old_balance label="Old Market Price" value={`₱${Number(price.old_market_price).toLocaleString('en-PH')}`} />
          </div>
        </span>
      </div>
    </div>
  )
}