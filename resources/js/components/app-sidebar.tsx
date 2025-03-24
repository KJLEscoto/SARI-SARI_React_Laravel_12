import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Archive, CalendarDaysIcon, Users2 } from 'lucide-react';
import AppLogo from './app-logo';
import { DateToday } from './date-today';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Inventory',
        href: '/admin/inventory',
        icon: Archive,
    },
    {
        title: 'Customers',
        href: '/admin/customers',
        icon: Users2,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Github Repo',
//         href: 'https://github.com/KJLEscoto/SARI-SARI_React_Laravel_12.git',
//         icon: Folder,
//     },
//     {
//         title: 'Laravel Docx',
//         href: 'https://laravel.com/docs/starter-kits',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('admin.dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <SidebarMenuButton size="lg" asChild variant="default">
                    <div className='flex'>
                        <div className="text-sidebar-accent-foreground flex aspect-square size-8 items-center justify-center">
                            <CalendarDaysIcon />
                        </div>
                        <div className="ml-1 grid flex-1 text-left text-sm">
                            <DateToday />
                        </div>
                    </div>
                </SidebarMenuButton>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
