import { Download } from "lucide-react";
import { Button } from "./ui/button";

export default function Cards({ title, description, onClick }: { title?: string; description?: string; onClick?: () => void; }) {
  return (
    <section className="flex flex-wrap gap-2 justify-between w-full items-center px-4 py-2 border rounded-sm">
      <div className='space-y-1'>
        <h2 className="font-medium text-black dark:text-white">{title}</h2>
        <p className='text-sm dark:text-white/80 text-black/80'>{description}</p>
      </div>
      <Button type="button" variant="default" size="sm" onClick={onClick}>
        Download
        <Download className="ml-1 h-4 w-4" />
      </Button>
    </section>
  );
}
