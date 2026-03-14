import Link from 'next/link';
import { Show } from '@/lib/mockData';

export default function ShowCard({ show }: { show: Show }) {
  return (
    <Link href={`/show/${show.id}`} className="group block">
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all duration-300 shadow-md hover:shadow-indigo-500/20 hover:-translate-y-1 relative h-full flex flex-col cursor-pointer">
        {/* Poster Wrapper */}
        <div className="aspect-[2/3] bg-slate-900 relative overflow-hidden flex items-center justify-center">
          {show.poster_url ? (
            <img 
              src={show.poster_url} 
              alt={show.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-slate-500 font-medium">Afiş Gelecek</span>
          )}
          {/* İçinde "Proje" vs yazılabilecek overlay katmanı (opsiyonel) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        </div>
        
        {/* Kart Alt Bilgi */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-white text-lg truncate group-hover:text-indigo-400 transition-colors">
            {show.title}
          </h3>
          <p className="text-slate-400 text-sm mt-2 line-clamp-2">
            {show.synopsis || "Sezon ve tartışma verileri eklenecek."}
          </p>
          <div className="mt-4 text-xs font-semibold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Tartışmalara Katıl →
          </div>
        </div>
      </div>
    </Link>
  );
}
