'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/reports', label: 'Reports' },
    { href: '/dashboard/users', label: 'Users' },
    { href: '/dashboard/settings', label: 'Settings' },
  ];
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 bg-[#FF4D00] p-6 text-white lg:block">
          <div className="mb-8 border-b border-white/15 pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">Ministry</p>
            <h2 className="mt-2 text-xl font-bold text-white">Dashboard</h2>
          </div>

          <nav className="space-y-2 text-sm">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-4 py-3 transition ${
                    isActive
                      ? 'bg-white/15 font-semibold text-white shadow-sm hover:bg-white/20'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="flex flex-1 flex-col">
          <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dashboard</p>
                <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
              </div>
              <div className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600">Admin</div>
            </div>
          </header>

          <div className="flex-1 p-6 lg:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
