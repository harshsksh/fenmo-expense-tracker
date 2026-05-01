'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Portfolio', href: '/dashboard' },
    { name: 'Insights', href: '/dashboard/insights' },
    { name: 'Vault', href: '/dashboard/vault' },
  ];

  return (
    <nav className="hidden md:flex space-x-8">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`font-['Work_Sans'] tracking-tight transition-all duration-200 pb-1 ${
              isActive
                ? 'text-teal-500 font-semibold border-b border-teal-500'
                : 'text-zinc-400 font-medium hover:text-teal-400'
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
