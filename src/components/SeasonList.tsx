import Link from 'next/link';

export default function SeasonList({ seasons, showId }: { seasons: number[], showId: string }) {
  return (
    <div className="mt-12 w-full">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Sezon Odaları</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {seasons.map((seasonNum) => (
          <Link 
            key={seasonNum} 
            href={`/show/${showId}/season/${seasonNum}`}
            className="group block"
          >
            <div className="bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1 h-full flex flex-col justify-center items-center text-center">
              <h3 className="text-2xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors mb-2">
                {seasonNum}. Sezon
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Tartışma Odası
              </p>
              <div className="flex items-center text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Odasına Git →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
