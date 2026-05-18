'use client';

import { useEffect, useState } from 'react';
import socket from '@/services/socket';
import axios from 'axios';

interface UserScore {
  id: string;
  username: string;
  totalScore: number;
}

interface SolveEvent {
  userId: string;
  username: string;
  challengeTitle: string;
  points: number;
  totalScore: number;
  solvedAt: string;
}

export default function ScoreboardPage() {
  const [scores, setScores] = useState<UserScore[]>([]);
  const [recentSolves, setRecentSolves] = useState<SolveEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial scoreboard
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('/api/scoreboard');
        setScores(response.data);
      } catch (error) {
        console.error('Failed to fetch initial scoreboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // 2. Setup WebSocket
    socket.connect();

    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to Monolith WebSocket');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('new-solve', (data: SolveEvent) => {
      // Add to recent solves
      setRecentSolves((prev) => [data, ...prev].slice(0, 5));
      
      // Update leaderboard
      setScores((prevScores) => {
        const userIndex = prevScores.findIndex(u => u.id === data.userId);
        if (userIndex !== -1) {
          const newScores = [...prevScores];
          newScores[userIndex] = { ...newScores[userIndex], totalScore: data.totalScore };
          return newScores.sort((a, b) => b.totalScore - a.totalScore);
        } else {
          // If new user solves first time
          return [...prevScores, { id: data.userId, username: data.username, totalScore: data.totalScore }]
            .sort((a, b) => b.totalScore - a.totalScore);
        }
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new-solve');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Leaderboard</h1>
          <p className="text-slate-400">Real-time ranking of top players.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">
            {connected ? 'Live Sync' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
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
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-slate-500">Loading rankings...</td>
                  </tr>
                ) : scores.length > 0 ? (
                  scores.map((user, index) => (
                    <tr key={user.id} className="hover:bg-blue-500/5 transition-colors group">
                      <td className="px-6 py-4 font-mono text-slate-500">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {user.username}
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

        {/* Recent Activity Feed */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4 text-slate-300 flex items-center gap-2">
            <span>Recent Activity</span>
            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full text-white">LIVE</span>
          </h2>
          <div className="space-y-4">
            {recentSolves.length > 0 ? (
              recentSolves.map((solve, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl animate-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-blue-400">{solve.username}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{new Date(solve.solvedAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Solved <span className="text-emerald-400 font-medium">{solve.challengeTitle}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2">
                    +{solve.points} points
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-slate-900/30 border border-dashed border-slate-800 p-8 rounded-xl text-center">
                <p className="text-sm text-slate-500 italic">Waiting for solves...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
