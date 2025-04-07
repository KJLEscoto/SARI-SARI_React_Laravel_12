export default function PosInfo() {
  return (
    <div className='flex flex-wrap gap-5'>
      <section className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-200 dark:bg-red-950 border border-red-500 shadow"></div>
        <p className="text-sm">Low Stock (Below 5 stock)</p>
      </section>
      <section className="flex items-center gap-2">
        <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-950 border border-yellow-500 shadow"></div>
        <p className="text-sm">Expired Product</p>
      </section>
    </div>
  )
} 