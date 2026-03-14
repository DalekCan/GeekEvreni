import Link from 'next/link';
import { Show } from '@/lib/mockData';

export default function SeasonList({ seasons, showId }: { seasons: number[], showId: string }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <span className="w-8 h-1 bg-indigo-500 rounded-full inline-block"></span>
        Sezon Odaları
      </h2>
      <div className="grid gap-4">
        {seasons.map((season) => (
          <Link 
            key={season} 
            href={`/show/${showId}/season/${season}`}
            className="group flex items-center justify-between p-5 bg-slate-800/50 hover:bg-slate-700 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex flex-col items-center justify-center border border-slate-700 group-hover:border-indigo-400 group-hover:text-indigo-400 transition-colors">
                <span className="text-xs text-slate-400 group-hover:text-indigo-300">Sezon</span>
                <span className="font-bold text-lg text-white group-hover:text-indigo-400">{season}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {season}. Sezon Tartışma Odası
                </h3>
                <p className="text-sm text-slate-400">
                  Bölümler ve teoriler hakkında konuşun
                </p>
              </div>
            </div>
            <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">
               {/* Arrow Icon Placeholder */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
