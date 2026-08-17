import Link from "next/link";

const footerLinks = [
  { href: "#", label: "About" },
  { href: "#", label: "Help" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Cookies" },
  { href: "#", label: "Legal" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#F8F9FA]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xs">
          <p className="text-lg font-bold tracking-tight text-orange-500">
            RecipeHub
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Helping the world cook one recipe at a time.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-slate-600 transition-colors hover:text-orange-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-slate-500 md:text-right">
          © 2024 RecipeHub. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
