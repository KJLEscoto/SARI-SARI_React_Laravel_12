import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { NavItem, type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { BookOpen, Folder } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'System settings',
    href: 'admin/settings/system',
  },
];

const links = [
  {
    title: 'Github Repository',
    href: 'https://github.com/KJLEscoto/SARI-SARI_React_Laravel_12.git',
    icon: Folder,
  },
  {
    title: 'Laravel Documentation',
    href: 'https://laravel.com/docs/',
    icon: BookOpen,
  },
];

export default function System() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="System settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="About" description="The current version and details of the system" />

          <div className="grid grid-cols-2 gap-4">
            {links.map((link) => (
              <div key={link.title}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 text-sm hover:bg-gray-100 rounded-md p-2 border border-gray-100"
                >
                  {link.title}
                  <link.icon className="text-gray-400" size="16" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
