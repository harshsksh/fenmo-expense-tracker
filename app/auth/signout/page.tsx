'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function SignOutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-error/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="w-full max-w-md bg-surface-container border border-white/5 rounded-[40px] p-12 shadow-2xl shadow-black/50 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-4xl text-error">logout</span>
        </div>
        
        <h1 className="font-h1 text-3xl text-on-surface mb-4">Sign Out</h1>
        <p className="text-on-surface-variant font-body-sm mb-12">
          Are you sure you want to end your current session? You'll need to sign back in to access your data.
        </p>

        <div className="flex flex-col w-full gap-4">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full h-14 bg-error text-on-error font-button-label text-sm rounded-2xl hover:bg-error/80 transition-all duration-300 shadow-lg shadow-error/10"
          >
            Yes, Sign Out
          </button>
          
          <Link
            href="/dashboard"
            className="w-full h-14 bg-surface-container-highest/50 text-on-surface font-button-label text-sm rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all duration-300"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
