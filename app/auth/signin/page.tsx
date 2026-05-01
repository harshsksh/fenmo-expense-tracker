'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-md bg-surface-container border border-white/5 rounded-[40px] p-12 shadow-2xl shadow-black/50 flex flex-col items-center text-center">
        <div className="font-['Work_Sans'] text-3xl font-bold text-primary mb-8">ExpenseTrack.</div>
        
        <h1 className="font-h1 text-3xl text-on-surface mb-4">Welcome Back</h1>
        <p className="text-on-surface-variant font-body-sm mb-12">
          Sign in to access your financial portfolio and track every rupee with precision.
        </p>

        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full h-14 bg-on-surface text-surface font-button-label text-sm rounded-2xl flex items-center justify-center gap-3 hover:bg-primary hover:text-on-primary transition-all duration-300 group shadow-lg shadow-black/20"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:invert transition-all" />
          Continue with Google
        </button>

        <div className="mt-12 pt-8 border-t border-white/5 w-full">
          <Link href="/" className="text-xs font-data-md text-on-surface-variant hover:text-primary transition-colors">
            ← Back to Landing Page
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs font-data-md text-on-surface-variant/40 uppercase tracking-widest">
        Powered by Fenmo AI engine
      </p>
    </div>
  );
}
