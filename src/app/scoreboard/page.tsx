'use client';

import useSWR from 'swr';
import axios from 'axios';

interface UserScore {
  id: string;
  username: string;
  totalScore: number;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ScoreboardPage() {
  const { data: scores, error, isLoading } = useSWR<UserScore[]>('/api/scoreboard', fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Leaderboard</h1>
          <p className="text-slate-400">Real-time ranking of top players.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full">
          <div className={`w-3 h-3 rounded-full ${!error ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">
            {!error ? 'Live Sync' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 uppercase text-xs font-bold tracking-[0.2em]">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-500">Loading rankings...</td>
                </tr>
              ) : scores && scores.length > 0 ? (
                scores.map((user, index) => (
                  <tr key={user.id} className="hover:bg-blue-500/5 transition-colors group">
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                      {user.username || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="bg-blue-400/10 text-blue-400 px-3 py-1 rounded-full font-mono font-bold border border-blue-400/20">
                        {user.totalScore.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-500 italic">No players yet. Be the first!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
