export function MoreDetails({ label, value, highlight, old_balance, status, type }: { label: string; value: string | number; highlight?: boolean; old_balance?: boolean; status?: string; type?: string }) {

  return (
    <p
      className={`
        w-full flex justify-between flex-wrap bg-white dark:bg-black dark:hover:!bg-accent 
        ${highlight ? "!bg-black/80 hover:!bg-black text-white dark:bg-white/20 dark:hover:!bg-white/30" : ""}
        ${old_balance ? "!bg-red-100 hover:!bg-red-200 text-black dark:!bg-red-800 dark:hover:!bg-red-700 dark:text-white" : ""}
        ${(status === "borrow" || status === "pending") ? "!bg-yellow-100 hover:!bg-yellow-200 text-black dark:!bg-yellow-600 dark:hover:!bg-yellow-500 dark:text-white" : ""} 
        ${(status === "paid" || status === "pay") ? "!bg-green-100 hover:!bg-green-200 text-black dark:!bg-green-800 dark:hover:!bg-green-700 dark:text-white" : ""} 
      `}
    >


      <span className="font-semibold text-start text-sm w-1/3">{label}</span>
      <span className="text-end w-2/3">{value}</span>
    </p>
  );
}
