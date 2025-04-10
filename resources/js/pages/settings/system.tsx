import { Head, router } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { BookOpen, Folder, Download, MousePointerClick, Database, DatabaseBackup } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

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

interface DatabaseBackup {
  id: number;
  user_id: number;
  path: string;
  created_at: string;
  updated_at: string;
}

export default function System({ files }: SystemProps) {
  // const handleDownload = (fileName: string) => {
  //   const downloadUrl = route('backup.download', { file: fileName });
  //   window.location.href = downloadUrl; // Triggers the download
  // };

  const [backups, setBackups] = useState<DatabaseBackup[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(backups.length / itemsPerPage);
  const paginatedBackups = backups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const fetchBackups = () => {
    axios.get('/get-backups')
      .then(response => {
        setBackups(response.data); // Set the backup data from the response
      })
      .catch(error => {
        console.error("There was an error fetching the backups:", error);
      });
  };

  const backup = () => {
    setIsBackingUp(true);

    axios.post('/backup')
      .then(response => {
        toast.success('Backed Up successfully!');
        setTimeout(fetchBackups, 1000); // Refresh after success
      })
      .catch(error => {
        toast.error('Backup failed. Please try again.');
        fetchBackups(); // Refresh after failure
      })
      .finally(() => {
        setIsBackingUp(false);
      });
  };


  const download = (fileName?: string) => {
    const downloadUrl = route('download.backup', { file: fileName });
    window.location.href = downloadUrl;
  }

  useEffect(() => {
    fetchBackups(); // Initial load
  }, []);

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
                // disabled={true}
                variant='outline'
                disabled={isBackingUp}
                onClick={backup}
              >
                {isBackingUp ? 'Backing Up...' : 'Back Up'}
                <DatabaseBackup className='w-4 h-4' />
              </Button>
            </div>
            <div className="overflow-x-auto overflow-hidden rounded-md border">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-xs text-black dark:text-white">File Name</th>
                    <th className="py-3 px-4 text-left text-xs text-black dark:text-white">Backed up since</th>
                    <th className="py-3 px-4 text-left text-xs text-black dark:text-white">Download</th>
                  </tr>
                </thead>
                {/* <tbody>
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
                  ): (
                      <tr className = "text-sm border-t">
                      <td colSpan = { 2 } className = "py-3 px-4 text-black dark:text-white/50 text-center">
                        No backups available.
                </td>
              </tr>
                  )}
            </tbody> */}
                <tbody>
                  {backups.length > 0 ? (
                    paginatedBackups.map((backup, index) => {
                      const fileName = backup.path.split('/').pop();
                      return (
                        <tr key={index} className="text-sm border-t">
                          <td className="py-3 px-4 text-black dark:text-white text-nowrap flex items-center gap-2">
                            <Database className='w-4 h-4' />
                            {fileName}
                          </td>
                          <td className="py-3 px-4 text-black dark:text-white text-nowrap">{backup.created_at && formatDistanceToNow(new Date(backup.created_at))}</td>
                          <td className="py-3 px-4">
                            <Button variant="default" size="sm" onClick={() => download(fileName)}>
                              <Download className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="text-sm border-t">
                      <td colSpan={3} className="py-3 px-4 text-black dark:text-white/50 text-center">
                        No backups available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-end items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Prev
                </Button>
                <span className="text-sm text-black dark:text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            )}
          </section>
        </div>
      </SettingsLayout >
    </AppLayout >
  );
}
