import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${api}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Registration failed. Email might already be taken.");
      }

      setSuccess("Account registered successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 px-4">
      <Card className="w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border-zinc-800/80 shadow-2xl">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-600/30 mb-4">
            A
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm mt-1">
            Get started with your administrator access
          </CardDescription>
        </CardHeader>

        <CardContent>
          {serverError && (
            <div className="bg-rose-950/30 border border-rose-800/50 text-rose-300 text-sm px-4 py-3 rounded-xl mb-6">
              {serverError}
            </div>
          )}

          {success && (
            <div className="bg-emerald-950/30 border border-emerald-800/50 text-emerald-300 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="register-name" className="text-zinc-300 text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-5 h-5" />
                </div>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  disabled={isLoading || !!success}
                  className="pl-11 pr-4 py-3 h-12 bg-zinc-800/50 border-zinc-700/60 text-white placeholder-zinc-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-zinc-300 text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="name@example.com"
                  disabled={isLoading || !!success}
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
              <Label htmlFor="register-password" className="text-zinc-300 text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading || !!success}
                  className="pl-11 pr-12 py-3 h-12 bg-zinc-800/50 border-zinc-700/60 text-white placeholder-zinc-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || !!success}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-confirm-password" className="text-zinc-300 text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading || !!success}
                  className="pl-11 pr-12 py-3 h-12 bg-zinc-800/50 border-zinc-700/60 text-white placeholder-zinc-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading || !!success}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-400 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !!success}
              size="lg"
              className="w-full py-3 h-12 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <div className="text-center mt-6">
              <span className="text-zinc-500 text-sm">Already have an account? </span>
              <Link
                to="/"
                className="text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
