import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login, loading: authLoading } = useAuth();

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${api}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Invalid email or password");
      }

      login(json.access_token);
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 px-4">
      <Card className="w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border-zinc-800/80 shadow-2xl">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-600/30 mb-4">
            A
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm mt-1">
            Sign in to your administration panel
          </CardDescription>
        </CardHeader>

        <CardContent>
          {serverError && (
            <div className="bg-rose-950/30 border border-rose-800/50 text-rose-300 text-sm px-4 py-3 rounded-xl mb-6 animate-slide-in">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-zinc-300 text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  disabled={isLoading}
                  className="pl-11 pr-4 py-3 h-12 bg-zinc-800/50 border-zinc-700/60 text-white placeholder-zinc-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-zinc-300 text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="pl-11 pr-12 py-3 h-12 bg-zinc-800/50 border-zinc-700/60 text-white placeholder-zinc-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full py-3 h-12 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center mt-6">
              <span className="text-zinc-500 text-sm">Don&apos;t have an account? </span>
              <Link
                to="/register"
                className="text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
