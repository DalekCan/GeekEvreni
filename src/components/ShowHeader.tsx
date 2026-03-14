import { Show } from '@/lib/mockData';

export default function ShowHeader({ show }: { show: Show }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl mt-6">
      <div className="relative z-10 flex flex-col md:flex-row gap-6 p-6 md:p-8 items-start md:items-center">
        {/* Poster */}
        <div className="flex-shrink-0 relative w-32 h-48 md:w-48 md:h-72 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
          <img 
            src={show.poster_url} 
            alt={show.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              {show.title}
            </h1>
          </div>
          
          <p className="text-slate-300 md:text-lg leading-relaxed max-w-3xl">
            {show.synopsis}
          </p>
        </div>
      </div>
    </div>
  );
}
