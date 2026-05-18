// services/frontend/src/app/challenges/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getChallenges } from '@/services/challengeService';
import { Challenge } from '@/types';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await getChallenges();
        setChallenges(data);
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading challenges...</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Challenges</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <div key={challenge.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-blue-500/50 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                  {challenge.category}
                </span>
                <span className="text-blue-400 font-mono">{challenge.points} pts</span>
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{challenge.title}</h2>
              <p className="text-slate-400 text-sm line-clamp-2">{challenge.description}</p>
              <button className="mt-6 w-full bg-slate-800 group-hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-all">
                Solve Challenge
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-slate-500 py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
            No challenges available yet.
          </div>
        )}
      </div>
    </div>
  );
}
