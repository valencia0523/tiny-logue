'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/auth/googleLogin'; // 공통 Google 로그인 함수 import
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('로그인 성공!');
      router.push('/');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const setUser = useAuthStore.getState().setUser; // 👈 상태 접근

    try {
      const resultUser = await signInWithGoogle();

      // ✅ Zustand에 저장
      setUser({
        uid: resultUser.uid,
        email: resultUser.email,
        displayName: resultUser.displayName,
        photoURL: resultUser.photoURL,
      });

      router.push('/');
    } catch (error: any) {
      alert('Google 로그인 실패: ' + error.message);
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-4 font-bold">로그인</h1>

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 mb-4"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-green-500 text-white p-2 rounded mb-2"
      >
        이메일로 로그인
      </button>

      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 text-white p-2 rounded"
      >
        Google로 로그인
      </button>
    </main>
  );
}
