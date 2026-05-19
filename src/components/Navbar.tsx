'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wider text-blue-400">
          CTF PLATFORM
        </Link>
        <div className="space-x-6 flex items-center">
          <Link href="/challenges" className="hover:text-blue-400 transition-colors">Challenges</Link>
          <Link href="/scoreboard" className="hover:text-blue-400 transition-colors">Scoreboard</Link>
          
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-slate-300 text-sm">{session.user?.name}</span>
              <button 
                onClick={() => signOut()}
                className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-md font-semibold transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn('google')}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition-all"
            >
              Login with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
