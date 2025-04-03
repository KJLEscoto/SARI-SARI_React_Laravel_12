export function MoreDetails({ label, value, highlight, old_balance }: { label: string; value: string | number; highlight?: boolean; old_balance?: boolean; }) {

  return (
    <p className={
      `w-full flex justify-between flex-wrap 
      ${highlight ? "bg-black/80 hover:!bg-black/80 text-white" : ""} 
      ${old_balance ? "bg-red-100 hover:!bg-red-100 text-black" : ""}`
    }>

      <span className="font-semibold text-start text-sm w-1/3">{label}</span>
      <span className="text-end w-2/3">{value}</span>
    </p>
  );
}
