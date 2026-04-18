'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { markAsWatched } from '@/lib/tracker-actions';

interface UpNextCardProps {
  id: string; // Tracker Row ID or Show ID
  showType: 'tv' | 'movie';
  season: number;
  episode: number;
  showName: string;
  episodeCode: string; // e.g., "S01E02"
  episodeName?: string;
  imageUrl: string;
}

export default function UpNextCard({ 
  id, 
  showType,
  season,
  episode,
  showName, 
  episodeCode, 
  episodeName, 
  imageUrl
}: UpNextCardProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticEpisode, setOptimisticEpisode] = useState(episode);
  const [optimisticCode, setOptimisticCode] = useState(episodeCode);

  const handleMarkWatched = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimizasyon: episode prop'u sıradaki (ekrandaki) bölümdür. Tıkladığında bu izlenip bir sonrakine geçilecektir.
    const newlyWatchedEpisode = optimisticEpisode;
    const displayNextEp = optimisticEpisode + 1;
    
    setOptimisticEpisode(displayNextEp);
    setOptimisticCode(`S${String(season).padStart(2,'0')}E${String(displayNextEp).padStart(2,'0')}`);

    startTransition(async () => {
      await markAsWatched({
        showId: id,
        showType,
        season,
        episode: newlyWatchedEpisode
      });
    });
  };

  return (
    <div className="flex-shrink-0 w-72 sm:w-80 flex items-center bg-slate-800/80 hover:bg-slate-700/80 transition-colors border border-slate-700 rounded-2xl p-2.5 gap-3 snap-start group relative">
      {/* Sol ve Orta Kısım: Link ile Sarılı */}
      <Link 
        href={`/show/${id}/season/${season}/episode/${optimisticEpisode}`}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        {/* Sol: Mini Afiş */}
        <div className="relative w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-600/50">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={showName} 
              fill 
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs font-bold uppercase p-1 text-center">
              {showName.substring(0, 2)}
            </div>
          )}
        </div>

        {/* Orta: Dizi Adı ve Bölüm Bilgisi */}
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs text-slate-400 truncate mb-0.5">{showName}</p>
          <p className="text-sm text-slate-100 font-bold truncate">
            {optimisticCode} {episodeName && <span className="text-slate-300 font-medium text-xs ml-1">- {episodeName}</span>}
          </p>
        </div>
      </Link>

      {/* Sağ: İzledim Butonu */}
      <button 
        onClick={handleMarkWatched}
        disabled={isPending}
        className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full transition-all border shadow-sm ${
          isPending 
            ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400 cursor-wait'
            : 'bg-slate-700/50 hover:bg-indigo-600 hover:text-white text-slate-400 hover:border-indigo-500 border-slate-600'
        }`}
        title="İzlendi Olarak İşaretle"
      >
        {isPending ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </button>
    </div>
  );
}
