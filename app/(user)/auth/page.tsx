"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AutPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<{ token: string }>("/auth/login", {
        email: loginData.email,
        password: loginData.password,
      });
      localStorage.setItem("token", response.token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<{ token: string }>("/auth/signup", {
        email: signupData.email,
        password: signupData.password,
      });
      localStorage.setItem("token", response.token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="border shadow-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border bg-muted/30">
              <Image
                src="/images/logo.png"
                alt="YggNet Logo"
                width={40}
                height={40}
                priority
                className="h-10 w-10"
              />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Welcome to YggNet
              </CardTitle>
              <CardDescription>
                Search, discover, and connect with knowledge.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs
              value={authMode}
              onValueChange={(value) => setAuthMode(value as "login" | "signup")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form className="space-y-4" onSubmit={handleLogin}>
                  {error && authMode === "login" && (
                    <div className="text-sm font-medium text-destructive">{error}</div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-9 pr-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                        aria-label="Toggle password visibility"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-muted-foreground/40"
                      />
                      Remember me
                    </label>

                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form className="space-y-4" onSubmit={handleSignup}>
                  {error && authMode === "signup" && (
                    <div className="text-sm font-medium text-destructive">{error}</div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-9 pr-10"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                        aria-label="Toggle password visibility"
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">
                      Confirm password
                    </Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Repeat your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-muted-foreground/40"
                    />
                    <p className="text-muted-foreground">
                      I agree to the terms and conditions.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
