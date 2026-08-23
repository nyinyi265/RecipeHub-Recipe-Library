"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/categories", label: "Categories" },
  { href: "/meal-planner", label: "Meal Planner" },
  { href: "/community", label: "Community" },
];

interface NavbarProps {
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated = false }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-orange-500">RecipeHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-orange-500",
                  pathname === link.href
                    ? "text-orange-500"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-orange-500">
            <Search className="h-5 w-5" />
          </Button>

          {isAuthenticated ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-orange-500 transition-colors"
            >
              <UserRound className="h-5 w-5" />
              Profile
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-orange-500 transition-colors"
              >
                Login
              </Link>

              <Button className="bg-orange-500 text-white hover:bg-orange-600" size="sm">
                Signup
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
