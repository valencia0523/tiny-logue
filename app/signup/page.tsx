'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { signInWithGoogle } from '@/lib/auth/googleLogin';
import {
  isNicknameTaken,
  saveUserToFirestore,
  registerNickname,
} from '@/lib/firestore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const router = useRouter();
  const setUser = useAuthStore.getState().setUser;

  const handleSignup = async () => {
    try {
      //Checking nickname availability
      const nicknameExists = await isNicknameTaken(nickname);
      if (nicknameExists) {
        toast.error('This nickname is already taken.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: nickname,
      });

      //Save user info in Firestore
      await saveUserToFirestore(user.uid, email, nickname);
      await registerNickname(nickname, user.uid);

      setUser({
        uid: user.uid,
        email: user.email,
        displayName: nickname,
        photoURL: null,
      });

      toast.success('	You’ve successfully signed up.');
      router.push('/');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error(
          <>
            This email is already registered.
            <br />
            Please log in instead.
          </>
        );
      } else {
        toast.error('Failed to sign up: ' + error.message);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (nickname && email && password) {
        handleSignup();
      } else {
        toast.error('Please fill in all fields before signing up.');
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const user = await signInWithGoogle();

      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      toast.success(
        `You’ve successfully signed up with Google. (${user.email})`
      );
      router.push('/');
    } catch (error: any) {
      toast.error('Failed to sign up with Google: ' + error.message);
    }
  };

  return (
    <main className="p-8 mt-25 max-w-md mx-auto md:mt-35 md:max-w-lg">
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-1 md:text-3xl">
          Welcome to
          <span className="italic md:text-4xl">Tiny Logue</span> ✨
        </h1>
        <p className="text-sm text-gray-600 md:text-lg md:mt-2">
          Start your English writing journey today!
        </p>
      </div>

      <div className="md:mt-5">
        <input
          type="text"
          placeholder="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border p-2 mb-4 md:p-3"
        />
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
          className="w-full border p-2 mb-4 md:p-3"
        />
        <Button
          onClick={handleSignup}
          className="w-full bg-[#b5d182] text-md py-6 hover:cursor-pointer hover:bg-[#a0bd6f] md:py-7"
        >
          Sign up
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2 mt-7 md:mt-8">
        <div className="italic">Prefer a different way to sign up?</div>
        <Button
          variant="outline"
          onClick={handleGoogleSignup}
          className="w-full text-md py-6 hover:cursor-pointer md:py-7"
        >
          <FcGoogle className="w-5 h-5 md:scale-150" />
          Continue with Google
        </Button>
      </div>
      <div className="mt-3 text-center md:hidden">
        <span>Or </span>
        <Link href="/login" className="italic underline text-lg">
          Log in
        </Link>
      </div>
    </main>
  );
}
