import Link from 'next/link';
import { auth } from '@/auth';
import ThemeToggle from '@/components/ThemeToggle';
import Navbar from '@/components/Navbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <>
      <header className="bg-zinc-950/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-white/5 shadow-lg shadow-black/40">
        <div className="flex justify-between items-center h-16 px-6 max-w-[1200px] mx-auto">
          <div className="font-['Work_Sans'] text-2xl font-bold text-teal-600 dark:text-teal-500">ExpenseTrack.</div>
          <Navbar />
          <div className="flex items-center space-x-4">
            <span className="hidden lg:block text-xs font-['IBM_Plex_Mono'] text-zinc-500 uppercase tracking-widest">Powered by Fenmo AI</span>
            <span className="material-symbols-outlined text-zinc-400 cursor-pointer hover:text-teal-400 transition-colors">notifications</span>
            <ThemeToggle />
            
            {session?.user ? (
              <div className="flex items-center gap-3 ml-4 border-l border-white/10 pl-4">
                {session.user.image ? (
                  <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full border border-white/10" />
                ) : (
                  <span className="material-symbols-outlined text-zinc-400">account_circle</span>
                )}
                <Link href="/api/auth/signout" className="text-xs font-button-label text-zinc-400 hover:text-error transition-colors">Sign Out</Link>
              </div>
            ) : (
              <Link href="/api/auth/signin" className="material-symbols-outlined text-zinc-400 hover:text-teal-400 transition-colors">account_circle</Link>
            )}
          </div>
        </div>
      </header>

      {/* Backdrop Visual Elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <main className="max-w-[1200px] mx-auto px-6 pt-32 pb-24">
        {children}
      </main>
    </>
  );
}
