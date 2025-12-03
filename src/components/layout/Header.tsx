"use client";

import Link from "next/link";
import { LogIn, UserPlus, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeaderProps } from "@/type/type";
import { LOGIN_PATH, REGISTER_PATH } from "@/const/path";

export default function Header({
  currentPage,
  isAuthenticated = false,
  user,
  onLogout,
}: HeaderProps) {
  const loginButtonClasses =
    currentPage === "login"
      ? "border-blue-600 text-blue-600 bg-blue-50"
      : "border-gray-300 text-gray-700 hover:bg-gray-100";

  const registerButtonClasses =
    currentPage === "register"
      ? "bg-blue-600 text-white"
      : "bg-blue-600 text-white hover:bg-blue-700";

  const isLoggedIn = !!(isAuthenticated && user);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo + title */}
          <div className="flex items-center gap-3">
            <Image
              src="/scam-logo.png"
              alt="Logo"
              width={60}
              height={60}
              priority
            />
            <div>
              <h1 className="text-gray-900">Smart Campus System</h1>
              <p className="text-gray-600">
                {isLoggedIn ? `Welcome, ${user!.name}` : "Teacher Portal"}
              </p>
            </div>
          </div>

          {/* Navigation + actions */}
          <nav className="flex items-center gap-4">
            {!isLoggedIn && (
              <>
                <a
                  href="#"
                  className="hidden text-gray-600 transition-colors hover:text-blue-600 md:inline"
                >
                  About
                </a>
                <a
                  href="#"
                  className="hidden text-gray-600 transition-colors hover:text-blue-600 md:inline"
                >
                  Contact
                </a>
                <a
                  href="#"
                  className="hidden text-gray-600 transition-colors hover:text-blue-600 md:inline"
                >
                  Help
                </a>

                {/* LOGIN */}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 ${loginButtonClasses}`}
                >
                  <Link href={LOGIN_PATH}>
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                </Button>

                {/* REGISTER */}
                <Button
                  asChild
                  size="sm"
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 ${registerButtonClasses}`}
                >
                  <Link href={REGISTER_PATH}>
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Link>
                </Button>
              </>
            )}

            {isLoggedIn && (
              <>
                <a
                  href="#"
                  className="hidden text-gray-600 transition-colors hover:text-blue-600 md:inline"
                >
                  My Bookings
                </a>
                <a
                  href="#"
                  className="hidden text-gray-600 transition-colors hover:text-blue-600 md:inline"
                >
                  Help
                </a>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
                  <div className="rounded-full bg-blue-100 p-2">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-gray-900">{user!.name}</p>
                    <p className="text-xs text-gray-600">{user!.email}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={onLogout}
                  disabled={!onLogout}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
