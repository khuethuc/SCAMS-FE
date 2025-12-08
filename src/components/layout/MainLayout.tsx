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
    { name: string; email: string } | undefined
  >();

  useEffect(() => {
    const syncAuth = () => {
      const userEmail = localStorage.getItem("userEmail");
      const userRole = localStorage.getItem("userRole");
      if (userEmail && userRole) {
        setIsAuthenticated(true);
        setUser({
          name: userEmail.split("@")[0],
          email: userEmail,
        });
      } else {
        setIsAuthenticated(false);
        setUser(undefined);
      }
    };
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`https://ase-251.onrender.com/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {}
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUser(undefined);
    router.push("/");
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
