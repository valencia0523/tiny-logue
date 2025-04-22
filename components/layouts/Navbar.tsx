'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/useAuthStore';
import LogoutButton from '@/components/auth/LogoutButton';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);

  // 메뉴 구성
  const baseItems = [
    { href: '/about', label: 'About' },
    { href: '/new-entry', label: 'New Entry' },
  ];

  const loggedInItems = [
    { href: '/my-logue', label: 'My Logue' },
    { href: '/community', label: 'Community' },
  ];

  const navbarItems = user ? [...baseItems, ...loggedInItems] : baseItems;

  return (
    <nav className="p-4 flex justify-between items-center bg-white shadow-md">
      {/* 왼쪽: 메뉴 */}
      <div className="flex gap-4">
        {navbarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-blue-600 hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* 오른쪽: 로그인/로그아웃/유저 정보 */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700 font-medium">
              안녕하세요, {user.displayName || 'TinyLoguer'}님 👋
            </span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="outline">로그인</Button>
            </Link>
            <Link href="/signup">
              <Button>회원가입</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
