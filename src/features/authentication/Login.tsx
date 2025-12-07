"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { REGISTER_PATH, BOOK_ROOM_PATH } from "@/const/path";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LoginProps } from "@/type/type";

export default function Login({
  onLogin,
  onSwitchToRegister,
}: LoginProps = {}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error responses
        if (data.error) {
          switch (data.error.code) {
            case "INVALID_REQUEST":
              setError("Please enter both email and password");
              break;
            case "INVALID_CREDENTIALS":
              setError("Email or password is incorrect");
              break;
            case "FORBIDDEN_ROLE":
              setError("You are not allowed to access this system");
              break;
            default:
              setError("An error occurred. Please try again");
          }
        } else {
          setError("An error occurred. Please try again");
        }
        return;
      }

      // Success - store role and redirect based on role
      const { role } = data;
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);

      // Call onLogin callback if provided
      if (onLogin) {
        onLogin(email, password);
      }

      // Redirect to book room page
      router.push(BOOK_ROOM_PATH);
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border border-gray-100 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your teacher account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.edu"
                required
                className="h-11"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-11"
              />
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-gray-600"
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="button"
                variant="link"
                className="px-0 text-sm font-normal text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <LogIn className="h-5 w-5" />
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
            </Button>
          </form>

          {/* Switch to register */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Button
              type="button"
              variant="link"
              onClick={() => onSwitchToRegister?.()}
              className="px-0 text-blue-600 hover:text-blue-700"
            >
              <Link href={REGISTER_PATH}>Register here</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
