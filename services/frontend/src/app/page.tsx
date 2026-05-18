// services/frontend/src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
        Welcome to CTF Platform
      </h1>
      <p className="text-xl text-slate-400 mb-10 max-w-2xl">
        Test your security and DevOps skills. Solve challenges, earn points, and climb the leaderboard in our real-time environment.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/challenges" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          View Challenges
        </Link>
        <Link 
          href="/scoreboard" 
          className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all"
        >
          Leaderboard
        </Link>
      </div>
    </div>
  );
}
