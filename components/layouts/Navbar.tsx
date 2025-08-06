"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/useAuthStore";
import LogoutButton from "@/components/auth/LogoutButton";
import { HiMenu } from "react-icons/hi";
import { useRef, useEffect, useState } from "react";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(false);

  //Navbar items
  const baseItems = [
    // { href: '/about', label: 'About' },
    { href: "/new-entry", label: "New Logue" },
  ];

  const loggedInItems = [
    { href: "/my-logue", label: "My Logue" },
    { href: "/community", label: "Community" },
  ];

  const navbarItems = user ? [...baseItems, ...loggedInItems] : baseItems;

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsNavbarOpen(false);
      }
    };

    if (isNavbarOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavbarOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 px-3 flex justify-between items-center shadow-md bg-[#FFFDF9]
      md:px-20"
      >
        <div className="flex justify-start items-center gap-30">
          {/* Navbar left - logo */}
          <div className="flex-shrink-0 w-auto md:scale-125">
            <Link href="/">
              <Image
                src="/images/tiny-logue-logo.png"
                alt="Tiny Logue Logo"
                width={150}
                height={50}
              />
            </Link>
          </div>
          {/* Navbar menu- big screen */}
          <div className="hidden md:flex text-xl gap-10">
            {navbarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:underline"
                onClick={() => setIsNavbarOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Navbar right- md, lg screen */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <span className="text-xl italic text-gray-600">
                Hi, {user.displayName || "TinyLoguer"} 👋
              </span>
              <LogoutButton />
            </>
          ) : (
            <div className="flex scale-105">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="text-lg mr-3 hover:cursor-pointer"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="text-lg bg-[#EFD6C0] text-[#5A4033] hover:cursor-pointer hover:bg-[#e6c8b0]">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Navbar right - small screen */}
        <div className="md:hidden">
          {user ? (
            <Button
              className="scale-120"
              variant="ghost"
              onClick={() => {
                setIsNavbarOpen(!isNavbarOpen);
              }}
            >
              <span>Hi, {user.displayName || "TinyLoguer"} 👋</span>
            </Button>
          ) : (
            <Button
              className="scale-200 hover:cursor-pointer hover-bg-transparent"
              variant="ghost"
              onClick={() => setIsNavbarOpen(!isNavbarOpen)}
            >
              <HiMenu />
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile menu only visible when HiMenu was clicked */}
      <div
        ref={menuRef}
        className={`absolute top-20 left-0 z-50 md:hidden overflow-hidden transition-all duration-500 ease-in-out bg-[#FFFDF9] text-xl w-full shadow-md py-5
    ${isNavbarOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
  `}
      >
        <div className="flex flex-col items-center gap-5">
          {navbarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:underline"
              onClick={() => setIsNavbarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center italic font-medium">
          {user ? (
            <LogoutButton onLogout={() => setIsNavbarOpen(false)} />
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="mr-5 hover:cursor-pointer"
                  onClick={() => setIsNavbarOpen(false)}
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="bg-[#EFD6C0] text-[#5A4033] hover:cursor-pointer 
                hover:bg-[#e6c8b0]"
                  onClick={() => setIsNavbarOpen(false)}
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
