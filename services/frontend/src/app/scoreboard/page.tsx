// services/frontend/src/app/scoreboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import socket from '@/services/socket';
import { SolveEvent } from '@/types';

export default function ScoreboardPage() {
  const [solves, setSolves] = useState<SolveEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to scoreboard WebSocket');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('new-solve', (data: SolveEvent) => {
      setSolves((prev) => [data, ...prev].slice(0, 20)); // Keep last 20 solves
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new-solve');
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-400">Live Scoreboard</h1>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-slate-400">{connected ? 'Live' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 uppercase text-xs tracking-widest">
              <th className="px-6 py-4 font-semibold">Time</th>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Challenge</th>
              <th className="px-6 py-4 font-semibold">Points</th>
              <th className="px-6 py-4 font-semibold">Total Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {solves.length > 0 ? (
              solves.map((solve, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors animate-in fade-in slide-in-from-left-4 duration-500">
                  <td className="px-6 py-4 text-slate-500 text-sm font-mono">
                    {new Date(solve.solvedAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-200">
                    {solve.username}
                  </td>
                  <td className="px-6 py-4 text-blue-400">
                    {solve.challengeTitle}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-400 font-mono">+{solve.points}</span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold">
                    {solve.totalScore}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                  Waiting for solve events...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
