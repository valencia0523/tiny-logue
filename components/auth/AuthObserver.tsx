"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function AuthObserver() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        clearUser();
      }
    });

    return () => unsubscribe(); // cleanup
  }, [setUser, clearUser]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}
