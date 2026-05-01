import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-zinc-950/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-white/5 shadow-lg shadow-black/40">
        <div className="flex justify-between items-center h-16 px-6 max-w-[1200px] mx-auto">
          <div className="font-['Work_Sans'] text-2xl font-bold text-teal-600 dark:text-teal-500">ExpenseTrack.</div>
          <nav className="hidden md:flex space-x-8">
            <Link className="text-teal-500 font-semibold border-b border-teal-500 pb-1 font-['Work_Sans'] tracking-tight transition-colors duration-200" href="/dashboard">Portfolio</Link>
            <Link className="text-zinc-400 font-medium font-['Work_Sans'] tracking-tight hover:text-teal-400 transition-colors duration-200" href="#">Insights</Link>
            <Link className="text-zinc-400 font-medium font-['Work_Sans'] tracking-tight hover:text-teal-400 transition-colors duration-200" href="#">Vault</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <span className="hidden lg:block text-xs font-['IBM_Plex_Mono'] text-zinc-500 uppercase tracking-widest">Powered by Fenmo AI</span>
            <span className="material-symbols-outlined text-zinc-400 cursor-pointer hover:text-teal-400 transition-colors">notifications</span>
            <span className="material-symbols-outlined text-zinc-400 cursor-pointer hover:text-teal-400 transition-colors">account_circle</span>
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
