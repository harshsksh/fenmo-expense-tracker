import Link from 'next/link';
import { auth } from '@/auth';

export default async function LandingPage() {
  const session = await auth();
  return (
    <div className="font-body-md selection:bg-primary selection:text-on-primary">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/40">
        <div className="flex justify-between items-center h-16 px-6 max-w-[1200px] mx-auto">
          <div className="font-['Work_Sans'] text-2xl font-bold text-teal-600 dark:text-teal-500">expensetrack.</div>
          <div className="hidden md:flex gap-8 items-center">
            <Link className="text-teal-500 font-semibold border-b border-teal-500 pb-1 font-['Work_Sans'] tracking-tight" href="#">Portfolio</Link>
            <Link className="text-zinc-400 font-medium hover:text-teal-400 transition-colors duration-200 font-['Work_Sans'] tracking-tight" href="#">Insights</Link>
            <Link className="text-zinc-400 font-medium hover:text-teal-400 transition-colors duration-200 font-['Work_Sans'] tracking-tight" href="#">Vault</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block font-button-label text-primary text-xs uppercase tracking-widest border border-primary/20 px-3 py-1 rounded-full">
              Powered by Fenmo AI <span className="ml-1">↗</span>
            </span>
            <div className="flex gap-4 items-center text-zinc-400">
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">notifications</span>
              {session ? (
                <Link href="/auth/signout" className="font-button-label text-sm hover:text-error transition-colors">Sign Out</Link>
              ) : (
                <Link href="/auth/signin" className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">account_circle</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 overflow-x-hidden">
        {/* Hero Section */}
        <section className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-rhythm-lg items-center">
          <div className="z-10">
            <h1 className="font-hero-heading text-[64px] leading-[1.1] mb-rhythm-sm text-on-surface">
              Your money, <br /><span className="text-primary">clearly.</span>
            </h1>
            <p className="text-on-surface-variant font-body-md text-lg max-w-md mb-rhythm-md">
              Track every rupee with precision using our Quiet Luxury engine. ExpenseTrack removes the noise, giving you total command over your financial outcomes.
            </p>
            <div className="flex flex-wrap gap-4 mb-rhythm-md">
              {session ? (
                <Link href="/dashboard" className="bg-primary-container text-on-primary-container px-8 py-4 rounded-[10px] font-button-label flex items-center gap-2 hover:scale-[1.02] transition-transform">
                  Go to Dashboard <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              ) : (
                <Link href="/auth/signin" className="bg-primary-container text-on-primary-container px-8 py-4 rounded-[10px] font-button-label flex items-center gap-2 hover:scale-[1.02] transition-transform">
                  Sign in with Google <span className="material-symbols-outlined text-sm">login</span>
                </Link>
              )}
              <button className="border border-outline-variant text-on-surface px-8 py-4 rounded-[10px] font-button-label hover:bg-white/5 transition-colors">
                See how it works
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="bg-surface-container-high px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
                <span className="text-primary font-data-md">₹0 float math</span>
              </div>
              <div className="bg-surface-container-high px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
                <span className="text-primary font-data-md">Retry-safe submissions</span>
              </div>
              <div className="bg-surface-container-high px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
                <span className="text-primary font-data-md">Instant filters</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-20 hero-blob rounded-full blur-3xl opacity-60"></div>
            <div className="relative bg-surface-container-highest/40 backdrop-blur-xl rounded-[40px] border border-primary/20 p-4 shadow-2xl">
              <img 
                alt="Financial Dashboard" 
                className="rounded-[32px] w-full h-auto grayscale-[0.2] contrast-[1.1]" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh31Cr6iJFIqQT_Sk3jDKc07pG4e_lOJHn3wfBzGOad-8r6_kylTPtjl497yF5ViDqHxK6eufIZxV-bu50I0uhq6T5ytgPs3oIbYJHCRCisBj4rSVClbu-mVG8nPelhyMe211lcAyaNHdSxMowi_aszwutbnvOayVBoxqM3NFacPaYQI7td2pLs_b9CQtiZf--z-S2LbEgQecplpyTwuUpTdn6sfHfHO93ULujbZJfARYT63vNH99V0oEfw15aFBHscgJTJudVYVY" 
              />
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="max-w-[1200px] mx-auto px-6 mt-rhythm-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-surface-container rounded-[20px] p-8 border border-white/5 hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">calculate</span>
              </div>
              <h3 className="font-h1 text-xl mb-4">Integer-precise money</h3>
              <p className="text-on-surface-variant font-body-sm">Track every rupee with precision using our Quiet Luxury engine. ExpenseTrack removes the noise, giving you total command over your financial outcomes.</p>
            </div>
            <div className="md:col-span-1 bg-surface-container rounded-[20px] p-8 border border-white/5 hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <h3 className="font-h1 text-xl mb-4">Retry-safe by design</h3>
              <p className="text-on-surface-variant font-body-sm">Track every rupee with precision using our Quiet Luxury engine. ExpenseTrack removes the noise, giving you total command over your financial outcomes.</p>
            </div>
            <div className="md:col-span-1 bg-surface-container rounded-[20px] p-8 border border-white/5 hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">filter_alt</span>
              </div>
              <h3 className="font-h1 text-xl mb-4">Filter by category</h3>
              <p className="text-on-surface-variant font-body-sm">Track every rupee with precision using our Quiet Luxury engine. ExpenseTrack removes the noise, giving you total command over your financial outcomes.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-[1200px] mx-auto px-6 mt-rhythm-lg text-center">
          <h2 className="font-h1 text-4xl mb-rhythm-md">Designed for flow.</h2>
          <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 pt-8">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-[52px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            
            <div className="relative z-10 flex-1 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-md mb-6 shadow-lg shadow-primary/20">1</div>
              <h4 className="font-h1 text-lg mb-2">Add expense</h4>
              <p className="text-on-surface-variant font-body-sm">Track every rupee with precision using our Quiet Luxury engine. ExpenseTrack removes the noise, giving you total command over your financial outcomes.</p>
            </div>
            <div className="relative z-10 flex-1 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-md mb-6 shadow-lg shadow-primary/20">2</div>
              <h4 className="font-h1 text-lg mb-2">Auto-categorized</h4>
              <p className="text-on-surface-variant font-body-sm">Track every rupee with precision using our Quiet Luxury engine. ExpenseTrack removes the noise, giving you total command over your financial outcomes.</p>
            </div>
            <div className="relative z-10 flex-1 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-md mb-6 shadow-lg shadow-primary/20">3</div>
              <h4 className="font-h1 text-lg mb-2">See totals instantly</h4>
              <p className="text-on-surface-variant font-body-sm">Track every rupee with precision using our Quiet Luxury engine. ExpenseTrack removes the noise, giving you total command over your financial outcomes.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-white/5 py-12 pb-32 md:pb-12">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="font-['Work_Sans'] text-2xl font-bold text-teal-600 dark:text-teal-500">expensetrack.</div>
            <p className="text-on-surface-variant font-body-sm">© 2026 ExpenseTrack. Built for the elite professional.</p>
          </div>
          <div className="flex gap-8 font-button-label text-sm text-zinc-400">
            <Link className="hover:text-primary transition-colors" href="#">Privacy</Link>
            <Link className="hover:text-primary transition-colors" href="#">Terms</Link>
            <Link className="hover:text-primary transition-colors" href="#">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
