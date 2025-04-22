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
} from '@/lib/firestore'; // ✅ 추가

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const router = useRouter();
  const setUser = useAuthStore.getState().setUser;

  const handleSignup = async () => {
    try {
      // ✅ 닉네임 중복 체크
      const nicknameExists = await isNicknameTaken(nickname);
      if (nicknameExists) {
        alert('이미 사용 중인 닉네임입니다.');
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

      // ✅ Firestore에 사용자 정보 저장
      await saveUserToFirestore(user.uid, email, nickname);
      await registerNickname(nickname, user.uid);

      setUser({
        uid: user.uid,
        email: user.email,
        displayName: nickname,
        photoURL: null,
      });

      alert('회원가입 성공!');
      router.push('/');
    } catch (error: any) {
      alert(error.message);
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

      alert(`Google 회원가입 성공! (${user.email})`);
      router.push('/');
    } catch (error: any) {
      alert('Google 회원가입 실패: ' + error.message);
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-4 font-bold">회원가입</h1>

      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="w-full border p-2 mb-4"
      />
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
        onClick={handleSignup}
        className="w-full bg-blue-500 text-white p-2 rounded mb-2"
      >
        이메일로 가입하기
      </button>

      <button
        onClick={handleGoogleSignup}
        className="w-full bg-red-500 text-white p-2 rounded"
      >
        Google로 가입하기
      </button>
    </main>
  );
}
