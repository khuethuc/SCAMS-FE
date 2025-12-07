"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { MainLayoutProps } from "@/type/type";

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | undefined>();

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");

    if (userEmail && userRole) {
      setIsAuthenticated(true);
      setUser({
        name: userEmail.split("@")[0], // Use part of email as name
        email: userEmail,
      });
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication data
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
