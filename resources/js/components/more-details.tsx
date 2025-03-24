export function MoreDetails({ label, value }: { label: string; value: string | number }) {
  return (
    <p className="w-full flex justify-between flex-wrap">
      <span className="font-semibold text-start text-sm w-1/3">{label}</span>
      <span className="text-end w-2/3">{value}</span>
    </p>
  );
}
