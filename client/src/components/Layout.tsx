import type { ReactNode } from 'react';
import { Header } from './Header';

type LayoutProps = {
  children: ReactNode;
  error?: string | null;
};

export function Layout({ children, error }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6">
        <Header />

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
          >
            {error}
          </div>
        )}

        {children}

        <footer className="mt-auto pt-10 text-center text-xs text-slate-600">
          React + Vite · NestJS · Tailwind · PostgreSQL
        </footer>
      </div>
    </div>
  );
}
