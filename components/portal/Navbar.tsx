"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useFetchAccount } from "@/hooks/accounts/actions";
import {
  LogOut,
  LayoutDashboard,
  Database,
  FileText,
  Menu,
  X,
  ChevronRight,
  User,
  Server,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: account, isLoading } = useFetchAccount();
  const [menuOpen, setMenuOpen] = useState(false);

  const isSuperuser = account?.is_superuser;
  const isClient = account?.is_client;

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navItems = [
    {
      name: "Dashboard",
      href: isSuperuser ? "/admin/dashboard" : "/dashboard",
      icon: LayoutDashboard,
      show: isSuperuser || isClient,
    },
    {
      name: "Clients",
      href: "/admin/clients",
      icon: User,
      show: isSuperuser,
    },
    {
      name: "Hubs",
      href: "/admin/hubs",
      icon: Server,
      show: isSuperuser,
    },
    {
      name: "Services",
      href: "/admin/hubservices",
      icon: Database,
      show: isSuperuser,
    },
    {
      name: "My Hubs",
      href: "/hubs",
      icon: Server,
      show: isClient,
    },
    {
      name: "Subscriptions",
      href: "/subscriptions",
      icon: FileText,
      show: isClient,
    },
    {
      name: "Available Services",
      href: "/hubservices",
      icon: Database,
      show: isClient,
    },
  ];

  return (
    <>
      <nav className="sticky top-0 w-full z-40 bg-slate-900 border-b border-slate-800 py-3 pr-2 shadow-2xl">
        <div className="mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95"
          >
            <Image
              src="/logo.png"
              alt="Corban Technologies Logo"
              width={140}
              height={38}
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Controls & Nav */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm text-white leading-none">
                {isLoading
                  ? "Loading..."
                  : `${account?.first_name || ""} ${account?.last_name || ""}`}
              </span>
              <span className={cn(
                "text-[10px] uppercase mt-1.5 px-3 py-1 rounded border shadow-sm",
                isSuperuser
                  ? "text-blue-500 bg-blue-500/5 border-blue-500/20 shadow-blue-500/5"
                  : isClient
                    ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5"
                    : "text-slate-400 bg-slate-800 border-slate-700"
              )}>
                {isSuperuser ? "Administrator" : isClient ? "Corporate Client" : "Portal User"}
              </span>
            </div>

            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800 hover:border-slate-700 shadow-2xl group"
            >
              <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[60] transition-opacity duration-300",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMenuOpen(false)}
      />

      {/* Side Menu Drawer */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-[340px] bg-slate-900 z-[70] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) border-l border-slate-800",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="p-2 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={32}
              className="h-6 w-auto object-contain brightness-0 invert"
            />
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info Section */}
          <div className="p-2 bg-gradient-to-b from-slate-900 to-slate-950/50 border-b border-slate-800">
            <div className="flex items-center gap-5">
              <div className={cn(
                "w-8 h-8 rounded flex items-center justify-center text-white text-sm border shadow transition-transform hover:scale-105",
                isSuperuser
                  ? "bg-blue-600 border-blue-600/20 shadow-blue-600/10"
                  : isClient
                    ? "bg-emerald-600 border-emerald-600/20 shadow-emerald-600/10"
                    : "bg-slate-800 border-slate-700"
              )}>
                {account?.first_name?.[0] || "?"}
                {account?.last_name?.[0] || "?"}
              </div>
              <div>
                <p className="text-white text-xl tracking-tight">
                  {account?.first_name} {account?.last_name}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className={cn(
                    "inline-flex items-center px-2 py-1 rounded border",
                    isSuperuser
                      ? "bg-blue-500/10 border-blue-500/20"
                      : isClient
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : "bg-slate-800 border-slate-700"
                  )}>
                    <span className={cn(
                      "text-[9px] font-semibold uppercase",
                      isSuperuser ? "text-blue-500" : isClient ? "text-emerald-500" : "text-slate-400"
                    )}>
                      {isSuperuser ? "Administrator" : isClient ? "Corporate Client" : "Portal User"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {navItems
              .filter((item) => item.show)
              .map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between p-2 rounded text-[11px] uppercase transition-all group border border-transparent",
                      isActive
                        ? "bg-slate-800/80 text-white border-slate-700 shadow-xl"
                        : "text-slate-500 hover:bg-slate-800/40 hover:text-white hover:border-slate-800/50",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-8 h-8 rounded flex items-center justify-center transition-all group-hover:scale-110 shadow-lg",
                          isActive
                            ? isSuperuser
                              ? "bg-blue-600 text-white shadow-blue-600/20"
                              : "bg-emerald-600 text-white shadow-emerald-600/20"
                            : "bg-slate-800/80 text-slate-600 group-hover:text-white shadow-black/5",
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      {item.name}
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1",
                        isActive && (isSuperuser ? "text-blue-500 opacity-100" : "text-emerald-500 opacity-100"),
                      )}
                    />
                  </Link>
                );
              })}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl">
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="w-full h-14 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded font-semibold flex items-center justify-center gap-3 transition-all border border-red-500/20 shadow-lg shadow-red-500/5 group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Sign Out Securely
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
