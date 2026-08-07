"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, LogOut } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { clearStoredToken, getStoredToken } from "@/lib/auth";

interface Profile {
  id: string;
  email: string;
  fullName: string;
  status: string;
  staffRole: string | null;
}

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/shipments", label: "Shipments", icon: Package },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getStoredToken()) {
      router.replace("/login");
      return;
    }
    apiFetch<Profile>("/me")
      .then(setProfile)
      .catch(() => {
        // apiFetch already redirects to /login on 401; other failures just
        // leave the header without a name rather than blocking the page.
      })
      .finally(() => setChecked(true));
  }, [router]);

  function signOut() {
    clearStoredToken();
    router.replace("/login");
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500" role="status">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 bg-[#081F3D] text-white flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <span className="font-bold text-sm">Nauterio Admin</span>
          <span className="block text-[10px] text-white/50 mt-0.5">Internal operations console</span>
        </div>
        <nav className="flex-1 py-4" aria-label="Admin navigation">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium ${
                  active ? "bg-white/10 text-white border-r-2 border-[#F28C18]" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-white/10 text-xs">
          {profile && (
            <div className="mb-2">
              <p className="font-semibold text-white">{profile.fullName}</p>
              <p className="text-white/50">{profile.staffRole ?? "No staff role"}</p>
            </div>
          )}
          <button onClick={signOut} className="flex items-center gap-1.5 text-white/70 hover:text-white">
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
