'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const clearUser = useAuthStore((state) => state.clearUser);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearUser(); // 상태에서 유저 제거
      alert('로그아웃 되었습니다');
      router.push('/');
    } catch (error: any) {
      alert('로그아웃 실패: ' + error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-500 text-white px-4 py-2 rounded"
    >
      로그아웃
    </button>
  );
}
