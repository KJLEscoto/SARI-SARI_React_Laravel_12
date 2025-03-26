import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getBalanceColor = (balance: number) => {
    if (balance < 0) return "text-current";
    if (balance <= 150) return "text-green-500";
    if (balance <= 999) return "text-blue-500";
    if (balance >= 1000) return "text-red-500";
    return "";
};


export const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imagePreview: string | null,
    setImagePreview: (preview: string | null) => void,
    setData: (key: string, value: File | null) => void
    ) => {
    const file = e.target.files?.[0] || null;

    // Revoke old object URL to avoid memory leaks
    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
    }

    if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setData("image", file);
    } else {
        setImagePreview(null);
        setData("image", null);
    }
};
