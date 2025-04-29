'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { FirebaseError } from 'firebase/app';

interface LogoutButtonProps {
  onLogout?: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const clearUser = useAuthStore((state) => state.clearUser);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearUser();

      if (onLogout) {
        onLogout();
      }
      toast.success('You’ve successfully logged out.');
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error('Failed to log out: ' + error.message);
      } else {
        toast.error('Failed to log out due to an unknown error.');
      }
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="hover:cursor-pointer"
    >
      Log out
    </Button>
  );
}
