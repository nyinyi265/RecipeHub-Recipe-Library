"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Globe, ImageUp, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.10z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.70 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.70 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.60 3.30-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="#1877F2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState<string>("");
  const [country, setCountry] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileError, setProfileError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    await signOut({ redirect: false });
    await signIn(
      "google",
      { callbackUrl: "/auth/redirect" },
      { prompt: "select_account" },
    );
  }

  async function handleFacebookSignIn() {
    setIsFacebookLoading(true);
    await signIn("facebook", { callbackUrl: "/auth/redirect" });
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  function handleProfileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setProfileError("");

    if (file) {
      if (!allowedMimeTypes.includes(file.type)) {
        setProfileError("Only JPG, PNG, GIF, and WebP images are allowed.");
        e.target.value = "";
        return;
      }
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setProfileFile(null);
      setProfilePreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setProfileError("");

    if (profileError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      if (gender) {
        formData.set("gender", gender);
      }

      if (country) {
        formData.set("country", country);
      }

      if (profileFile) {
        formData.set("profile", profileFile);
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFormError(data.error ?? "Registration failed. Please try again.");
        return;
      }

      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/auth/redirect",
      });

      if (signInResult?.error) {
        setFormError(
          "Account created, but sign-in failed. Please sign in manually.",
        );
        router.push("/login");
        return;
      }

      toast.success("Account created successfully! Welcome to RecipeHub.");
      window.location.href = signInResult?.url || "/auth/redirect";
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden h-full overflow-hidden lg:block">
          <Image
            src="/images/login.png"
            alt="Fresh ingredients on a wooden table"
            fill
            priority
            sizes="(min-width:1024px) 60vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0" />
          <div className="absolute left-8 bottom-12 z-10 max-w-md text-white">
            <h1 className="text-4xl font-semibold leading-tight">
              Start your culinary journey.
            </h1>
            <p className="mt-4 text-base text-white/80">
              Create an account to unlock personalised recipes, meal plans, and
              smart shopping lists.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full px-8">
            <div className="mx-auto w-full p-8">
              <div className="text-slate-900">
                <span className="inline-flex bg-transparent py-1 text-2xl font-bold tracking-[0.25em] text-orange-600">
                  RecipeHub
                </span>
                <div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                    Create Account
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Join the community and start cooking smarter.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-2">
                <div>
                  <Label htmlFor="name" className="text-sm text-slate-700">
                    Full Name
                  </Label>
                  <div className="relative mt-2">
                    <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Marie Dupont"
                      className="h-12 pl-10 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="marie@recipehub.com"
                      className="h-12 pl-10 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm text-slate-700">
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="at least 8 characters"
                      className="h-12 pl-10 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender" className="text-sm text-slate-700">
                    Gender
                  </Label>
                  <div className="relative mt-2">
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger
                        id="gender"
                        className="h-12 w-full border-slate-200 bg-white text-slate-900 pl-10 [&_svg:not([class*='size-'])]:size-4"
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                        <SelectItem value="PREFER_NOT_TO_SAY">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm text-slate-700">
                    Country
                  </Label>
                  <div className="relative mt-2">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="United States"
                      className="h-12 pl-10 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="profile"
                    className="text-sm text-slate-700"
                  >
                    Profile Picture
                  </Label>
                  <div className="mt-2">
                    {profilePreview ? (
                      <div className="relative mb-3 flex items-center gap-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-200">
                          <Image
                            src={profilePreview}
                            alt="Profile preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileFile(null);
                            setProfilePreview(null);
                          }}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="mb-3 flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
                        <ImageUp className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                    <Input
                      id="profile"
                      name="profile"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleProfileChange}
                      className="h-12 border-slate-200 bg-white text-slate-900 file:mr-3 file:rounded file:border-0 file:bg-orange-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-orange-600 hover:file:bg-orange-100"
                    />
                    {profileError && (
                      <p className="mt-1 text-sm text-red-500">
                        {profileError}
                      </p>
                    )}
                  </div>
                </div>

                {formError && (
                  <p className="pt-2 text-sm text-red-500">{formError}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-orange-500 px-4 py-5 text-base font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-10">
                <div className="relative">
                  <Separator className="mb-4" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs uppercase tracking-[0.28em] text-slate-400">
                    or continue with
                  </span>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    className="flex items-center justify-center gap-2 py-5 rounded-xl bg-white text-slate-900 border-1 border-orange-200 cursor-pointer hover:bg-slate-50"
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <GoogleIcon className="h-4 w-4" />
                    )}
                    {isGoogleLoading ? "Redirecting..." : "Google"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleFacebookSignIn}
                    disabled={isFacebookLoading}
                    className="flex items-center justify-center gap-2 py-5 rounded-xl bg-white text-slate-900 border-1 border-orange-200 cursor-pointer hover:bg-slate-50"
                  >
                    {isFacebookLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FacebookIcon className="h-4 w-4" />
                    )}
                    {isFacebookLoading ? "Redirecting..." : "Facebook"}
                  </Button>
                </div>
              </div>

              <div className="pt-4 text-center text-sm text-slate-600">
                <p>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-slate-900 hover:text-orange-600"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
