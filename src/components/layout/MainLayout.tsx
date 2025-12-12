"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { MainLayoutProps } from "@/type/type";

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<
    { name: string; email: string; id?: string } | undefined
  >();

  useEffect(() => {
    const AUTH_SYNC_EVENT = "scams-auth-change";

    const syncAuth = () => {
      const userEmail = localStorage.getItem("userEmail");
      const userRole = localStorage.getItem("userRole");
      const userName = localStorage.getItem("userName");
      const userId = localStorage.getItem("userId");

      const hasIdentity = Boolean(userEmail || userId);
      const nextAuthenticated = Boolean(userRole && hasIdentity);

      setIsAuthenticated(nextAuthenticated);

      if (nextAuthenticated) {
        const fallbackName = userEmail?.split("@")[0] ?? userId ?? "User";
        setUser({
          // prefer a stored userName (set during login) otherwise fallback to derived identity
          name: userName ?? fallbackName,
          email: userEmail ?? userId ?? "",
          id: userId ?? undefined,
        });
      } else {
        setUser(undefined);
      }
    };

    // run once on mount
    syncAuth();

    // listen for both storage events (cross-tab) and our custom auth-change event
    window.addEventListener("storage", syncAuth);
    window.addEventListener(AUTH_SYNC_EVENT, syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener(AUTH_SYNC_EVENT, syncAuth);
    };
  }, []);

  const handleLogout = () => {
    // Xoá toàn bộ thông tin đăng nhập
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    // Sync state
    setIsAuthenticated(false);
    setUser(undefined);

    window.dispatchEvent(new Event("scams-auth-change"));

    window.location.href = "/";
  };

  return (
    <div>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 container mx-auto py-6">{children}</main>
      <Footer />
    </div>
  );
}
