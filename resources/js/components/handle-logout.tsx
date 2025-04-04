import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';

export function HandleLogout() {
  const { post } = useForm();
  const cleanup = useMobileNavigation();

  const handleLogout = () => {
    post(route('logout'), {
      onSuccess: cleanup,
    });
  };

  return (
    <Dialog>
      <DialogTrigger className='w-full'>
        <Button variant='destructive' className='relative w-full flex justify-start hover:bg-red-500'>
          <LogOut className="mr-2 text-white" />
          Log out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Logout Confirmation</DialogTitle>
        <DialogDescription>
          Are you sure you want to logout?
        </DialogDescription>
        <DialogFooter className="flex w-full justify-end gap-3">
          <DialogClose asChild>
            <Button type="button" size="sm" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button variant='destructive' type='submit' size='sm' className='hover:bg-red-500' onClick={handleLogout}>
            Log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 