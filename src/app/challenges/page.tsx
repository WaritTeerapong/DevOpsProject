import { prisma } from '@/lib/prisma';
import SubmitFlagForm from '@/components/SubmitFlagForm';

export const dynamic = 'force-dynamic';

// This is a Server Component by default in Next.js App Router
export default async function ChallengesPage() {
  const challenges = await prisma.challenge.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      points: true,
      category: true,
    },
    orderBy: {
      points: 'asc',
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Challenges
          </h1>
          <p className="text-slate-400">
            Select a challenge and submit the flag to earn points.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-sm font-medium text-slate-500 block uppercase tracking-widest">
            Total Challenges
          </span>
          <span className="text-2xl font-bold text-blue-400">
            {challenges.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all flex flex-col shadow-xl shadow-black/20"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                  {challenge.category}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-black text-white leading-none">
                    {challenge.points}
                  </span>
                  <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold">
                    Points
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-blue-400 transition-colors">
                {challenge.title}
              </h2>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                {challenge.description}
              </p>

              {/* Client Component for interactive part */}
              <SubmitFlagForm challengeId={challenge.id} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Challenges Found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              We couldn't find any challenges in the database. Try running the seed script!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
