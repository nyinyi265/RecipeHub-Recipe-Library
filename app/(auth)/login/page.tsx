"use client"

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.10z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.70 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.70 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.60 3.30-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  async function handleGoogleSignIn() {
    await signOut({ redirect: false });
    await signIn("google", { callbackUrl: "/dashboard", prompt: "select_account" });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden h-full overflow-hidden lg:block">
          <Image
            src="/images/login.png"
            alt="Cooking scene"
            fill
            priority
            sizes="(min-width:1024px) 60vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0" />
          <div className="absolute left-8 bottom-12 z-10 max-w-lg text-white">
            <h1 className="text-4xl font-semibold leading-tight">Master the art of home cooking</h1>
            <p className="mt-4 text-base text-white/80">
              Join over 2 million culinary enthusiasts and transform your kitchen into a five-star experience.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full px-8">
            <div className="mx-auto w-full p-8">
              <div className="text-slate-900">
                <span className="inline-flex bg-transparent py-1 text-2xl font-bold tracking-[0.25em] text-orange-600">RecipeHub</span>
                <div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight">Welcome Back</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Sign in to access your saved recipes and meal plans.</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="mt-8 space-y-6"
              >
                <div>
                  <Label htmlFor="email" className="text-sm text-slate-700">Email Address</Label>
                  <div className="relative mt-2">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="email" name="email" type="email" placeholder="chef@recipehub.com" className="h-12 pl-10 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm text-slate-700">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-12 pl-10 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-orange-600" />
                    Remember me
                  </label>
                  <Link href="/forgot-password" className="text-sm text-slate-600 underline-offset-2 hover:text-orange-600">Forgot Password?</Link>
                </div>

                <Button type="submit" className="w-full rounded-lg bg-orange-500 px-4 py-5 text-base font-semibold text-white hover:bg-orange-600">Sign In</Button>
              </form>

              <div className="mt-10">
                <div className="relative">
                  <Separator className="mb-4" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs uppercase tracking-[0.28em] text-slate-400">or continue with</span>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Button variant="outline" onClick={handleGoogleSignIn} className="flex items-center justify-center gap-2 py-5 rounded-xl bg-white text-slate-900 border-1 border-orange-200 cursor-pointer hover:bg-slate-50">
                    <GoogleIcon className="h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2 py-5 rounded-xl bg-white text-slate-900 border-1 border-orange-200 cursor-pointer hover:bg-slate-50">
                    <FacebookIcon className="h-4 w-4" />
                    Facebook
                  </Button>
                </div>
              </div>

              <div className="pt-4 text-center text-sm text-slate-600">
                <p>
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="font-semibold text-slate-900 hover:text-orange-600">Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
