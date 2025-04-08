import { Head, router } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { BookOpen, Folder, Download, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

interface SystemProps {
  files: string[]; // Explicitly define 'files' as an array of strings
}

export default function System({ files }: SystemProps) {
  const handleDownload = (fileName: string) => {
    const downloadUrl = route('backup.download', { file: fileName });
    window.location.href = downloadUrl; // Triggers the download
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="System settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <section className="space-y-5">
            <HeadingSmall title="About" description="The current version and details of the system" />
            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-2">
              {links.map((link) => (
                <div key={link.title}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 text-sm hover:bg-gray-50 dark:hover:bg-black rounded-md px-3 py-2 border"
                  >
                    {link.title}
                    <link.icon className="text-gray-500 dark:text-white" size="16" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className='flex gap-2 items-end justify-between'>
              <HeadingSmall title="Database Backup" description="Automatic MySQL database backups for data recovery" />
              <Button
                disabled={true}
                variant='outline'
                onClick={() => {
                  router.post(route('backup.run'));
                }}
              >
                Back Up
                <MousePointerClick className='w-4 h-4' />
              </Button>
            </div>
            <div className="overflow-x-auto overflow-hidden rounded-md border">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-xs text-black dark:text-white">File Name</th>
                    <th className="py-3 px-4 text-left text-xs text-black dark:text-white">Get a copy</th>
                  </tr>
                </thead>
                <tbody>
                  {files.length > 0 ? (
                    files.map((file, index) => {
                      const fileName = file.split('/').pop() ?? 'Unknown File'; // Extract file name

                      return (
                        <tr key={index} className="text-sm border-t">
                          <td className="py-3 px-4 text-black dark:text-white text-nowrap">{fileName}</td>
                          <td className="py-3 px-4">
                            <Button variant="default" size="sm" onClick={() => handleDownload(fileName)}>
                              Download
                              <Download className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="text-sm border-t">
                      <td colSpan={2} className="py-3 px-4 text-black dark:text-white/50 text-center">
                        No backups available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
