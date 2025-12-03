"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { MainLayoutProps } from "@/type/type";

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <Header />
      <main className="flex-1 container mx-auto py-6">{children}</main>
      <Footer />
    </div>
  );
}
