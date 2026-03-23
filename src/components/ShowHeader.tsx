'use client';

import { Show } from '@/types';
import { useState } from 'react';
import Image from 'next/image';

export default function ShowHeader({ show }: { show: Show }) {
  const [imageError, setImageError] = useState(false);

  const displayTitle = show.name || show.title || 'İsimsiz Dizi';
  const initial = displayTitle.charAt(0).toUpperCase();
  
  // Yayın Tarihi Formatlama (GG.AA.YYYY)
  const rawDate = show.first_air_date || show.release_date;
  const formattedDate = rawDate 
    ? new Date(rawDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : null;

  // TMDB görsel base URL'i
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
  
  // Afiş kontrolü
  const posterUrl = show.poster_path ? `${TMDB_IMAGE_BASE}${show.poster_path}` : show.poster_url;
  const showPlaceholder = !posterUrl || imageError;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-xl mt-6">
      <div className="relative z-10 flex flex-col md:flex-row gap-6 p-6 md:p-10 items-start md:items-center">
        {/* Poster */}
        <div className="flex-shrink-0 relative w-32 h-48 md:w-56 md:h-80 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700 bg-slate-800 flex items-center justify-center">
          {showPlaceholder ? (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-900/50 to-slate-900">
              <span className="text-6xl md:text-8xl font-black text-slate-700/50 select-none">
                {initial}
              </span>
            </div>
          ) : (
            <Image 
              src={posterUrl!} 
              alt={displayTitle} 
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 128px, 224px"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-5">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-md">
              {displayTitle}
            </h1>
            {formattedDate && (
              <div className="flex items-center gap-2 text-indigo-400 font-medium text-lg mt-2 mb-2">
                <span className="text-xl">🗓️</span>
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
          
          <p className="text-slate-300 md:text-lg leading-relaxed max-w-3xl font-medium tracking-wide">
            {show.overview || show.synopsis}
          </p>
        </div>
      </div>
    </div>
  );
}
