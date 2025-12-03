"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { REGISTER_PATH } from "@/const/path";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && password) {
      onLogin?.(email, password);
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
              className="flex w-full items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
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
