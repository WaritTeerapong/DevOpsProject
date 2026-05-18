// services/frontend/src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wider text-blue-400">
          CTF PLATFORM
        </Link>
        <div className="space-x-6 flex items-center">
          <Link href="/challenges" className="hover:text-blue-400 transition-colors">Challenges</Link>
          <Link href="/scoreboard" className="hover:text-blue-400 transition-colors">Scoreboard</Link>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition-all">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
