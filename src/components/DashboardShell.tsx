"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navigation = [
  {
    name: "Leads",
    href: "/dashboard/leads",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
];

const adminNavigation = [
  {
    name: "Team",
    href: "/dashboard/users",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

function SidebarContent({ pathname, role }: { pathname: string; role: string }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-100">LeadFlow.</span>
        </Link>
      </div>

      <Separator className="bg-white/5 mx-4" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
          Main
        </p>
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500 rounded-r-md"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border-l-2 border-transparent rounded-r-md"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}

        {role === "admin" && (
          <>
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-8 mb-4">
              Admin
            </p>
            {adminNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500 rounded-r-md"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border-l-2 border-transparent rounded-r-md"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <Separator className="bg-white/5 mx-4" />

      {/* Footer info */}
      <div className="p-6">
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors"
        >
          Built for Digital Heroes
        </a>
      </div>
    </div>
  );
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  const role = session?.user?.role || "member";

  return (
    <div className="flex h-screen bg-[#0a0a0a] font-sans selection:bg-cyan-500/30 text-zinc-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r border-white/5 bg-[#0a0a0a]/50">
        <SidebarContent pathname={pathname} role={role} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 border-white/5 bg-[#0a0a0a]">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent pathname={pathname} role={role} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-zinc-400 hover:text-white"
            onClick={() => setMobileOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
            {/* User Dropdown / Info */}
            <div className="flex items-center gap-4 border-l border-white/5 pl-4 lg:pl-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-white">{session?.user?.name}</span>
                <span className="text-xs text-zinc-400 capitalize">{role}</span>
              </div>
              <Avatar className="h-10 w-10 border border-white/10 rounded-lg">
                <AvatarFallback className="bg-zinc-900 text-cyan-400 font-semibold rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-red-400 transition-colors ml-2"
                title="Log out"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          <div className="py-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
