import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Product {
    id: number;
    image?: string | null;
    name: string;
    // category: string;
    stock: number;
    selling_price: number;
    market_price: number;
    expiration_date?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Customer {
    id: number;
    image?: string | null;
    name: string;
    // category: string;
    phone: string;
    address: string;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    message: string;
    type: string;
    amount: number;
    old_balance: number;
    updated_balance: number;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    type: string;
    created_at: string;
    updated_at: string;
}

export interface Flash {
    success?: string;
    update?: string;
    warning?: string;
    error?: string;
    info?: string;
}