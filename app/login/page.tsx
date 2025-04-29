'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/auth/googleLogin';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('You’ve successfully logged in.');
      router.push('/');
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email.');
          break;
        case 'auth/wrong-password':
          toast.error('Incorrect password.');
          break;
        case 'auth/invalid-email':
          toast.error('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          toast.error('Too many login attempts. Please try again later.');
          break;
        default:
          toast.error('Failed to log in. Please try again.');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleGoogleLogin = async () => {
    const setUser = useAuthStore.getState().setUser;

    try {
      const resultUser = await signInWithGoogle();

      //Save in Zustand
      setUser({
        uid: resultUser.uid,
        email: resultUser.email,
        displayName: resultUser.displayName,
        photoURL: resultUser.photoURL,
      });

      router.push('/');
    } catch (error: any) {
      toast.error('Google login failed: ' + error.message);
    }
  };

  return (
    <main className="p-8 mt-25 max-w-md mx-auto md:mt-35 md:max-w-lg">
      <h1 className="text-2xl mb-4 font-bold md:text-4xl">Welcome back🌿</h1>
      <div className="md:mt-5">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border p-2 mb-4 md:p-3"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border p-2 mb-3 md:p-3"
        />
        <Button
          onClick={handleLogin}
          className="w-full bg-[#b5d182] text-md py-6 hover:cursor-pointer hover:bg-[#a0bd6f] md:py-7"
        >
          Log in
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2 mt-7 md:mt-8">
        <div className="italic">Prefer a different way to log in?</div>
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full text-md py-6 hover:cursor-pointer md:py-7"
        >
          <FcGoogle className="w-5 h-5 md:scale-130" />
          Continue with Google
        </Button>
      </div>
      <div className="mt-3 text-center md:hidden">
        <span>Or </span>
        <Link href="/signup" className="italic underline text-lg">
          Sign up
        </Link>
      </div>
    </main>
  );
}
