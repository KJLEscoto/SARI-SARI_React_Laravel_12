export default function BalanceInfo() {
  return (
    <div className='flex flex-wrap gap-5'>
      <section className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-200 dark:bg-green-950 border border-green-500 shadow"></div>
        <p className="text-sm">Less than ₱150</p>
      </section>
      <section className="flex items-center gap-2">
        <div className="w-3 h-3 bg-blue-200 dark:bg-blue-950 border border-blue-500 shadow"></div>
        <p className="text-sm">Less than ₱999</p>
      </section>
      <section className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-200 dark:bg-red-950 border border-red-500 shadow"></div>
        <p className="text-sm">Over ₱1000+</p>
      </section>
    </div>
  )
} 
