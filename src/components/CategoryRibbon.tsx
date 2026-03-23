'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useTransition, useEffect, useRef } from 'react';

export default function CategoryRibbon({ genres }: { genres: { id: number; name: string }[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentFormat = searchParams.get('format') || 'tv';
  const currentGenre = searchParams.get('genre');
  const currentFilter = searchParams.get('filter');
  
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    startTransition(() => {
      router.push(path);
    });
  };

  const handleFormatChange = (newFormat: string) => {
    // Hafıza koruması: Sadece genre silinir (tür uyumsuzluklarını önlemek için), filter korunur.
    const filterQuery = currentFilter ? `&filter=${currentFilter}` : '';
    handleNavigate(`/?format=${newFormat}${filterQuery}`);
  };

  const activeGenreName = genres.find(g => g.id.toString() === currentGenre)?.name;

  return (
    <div className="w-full pb-6 mb-6 flex flex-col gap-6 relative z-40">
      
      {/* KATMAN 1: Format Seçici (Segmented Control) */}
      <div className="flex justify-center border-b border-slate-800 pb-6 mb-2 pt-2">
        <div className="bg-slate-800/50 p-1 rounded-2xl flex items-center shadow-inner border border-slate-700/50">
          <button 
            onClick={() => handleFormatChange('tv')}
            disabled={isPending}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              currentFormat === 'tv' 
              ? 'bg-slate-700 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Diziler
          </button>
          <button 
            onClick={() => handleFormatChange('movie')}
            disabled={isPending}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              currentFormat === 'movie' 
              ? 'bg-slate-700 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Filmler
          </button>
          <button 
            onClick={() => handleFormatChange('anime')}
            disabled={isPending}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              currentFormat === 'anime' 
              ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 text-pink-400 shadow-md border border-pink-500/10' 
              : 'text-slate-400 hover:text-slate-200'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Animeler
          </button>
        </div>
      </div>

      {/* KATMAN 2: Durum Filtreleri (Alt Filtreler) */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 pb-2 sm:pb-0 font-medium">
          
          {/* Popüler */}
          <button 
            onClick={() => handleNavigate(`/?format=${currentFormat}`)}
            disabled={isPending}
            className={`px-5 py-2.5 rounded-xl whitespace-nowrap text-sm transition-all flex items-center gap-2 ${
               !currentGenre && !currentFilter
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>✨</span> Popüler
          </button>

          {/* Yeni Çıkanlar */}
          <button 
            onClick={() => handleNavigate(`/?format=${currentFormat}&filter=new`)}
            disabled={isPending}
            className={`px-5 py-2.5 flex items-center gap-2 rounded-xl whitespace-nowrap text-sm transition-all ${
              currentFilter === 'new'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-transparent'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>🔥</span> Yeni Çıkanlar
          </button>
          
          {/* Bitmiş Yapımlar */}
          <button 
            onClick={() => handleNavigate(`/?format=${currentFormat}&filter=completed`)}
            disabled={isPending}
            className={`px-5 py-2.5 flex items-center gap-2 rounded-xl whitespace-nowrap text-sm transition-all ${
              currentFilter === 'completed'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-transparent'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>🎬</span> Bitmiş Yapımlar
          </button>

          {/* Türler Klasörü - Dinamik Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className={`px-5 py-2.5 flex items-center gap-2 rounded-xl whitespace-nowrap text-sm transition-all ${
                  currentGenre
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-transparent'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>📂</span>
              {activeGenreName ? activeGenreName : 'Türler'}
              <svg className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            {isOpen && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 grid grid-cols-2 gap-1.5 animate-in fade-in slide-in-from-top-2 z-50">
                {genres.map((genre) => {
                  const isActive = currentGenre === genre.id.toString();
                  return (
                    <button 
                      key={genre.id}
                      onClick={() => handleNavigate(`/?format=${currentFormat}&genre=${genre.id}`)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                        ? 'bg-indigo-600 text-white font-medium shadow-sm'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {genre.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Loading Spinner */}
        {isPending && (
           <div className="hidden sm:flex items-center gap-2 text-indigo-400 font-medium text-sm animate-pulse ml-4">
              <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
           </div>
        )}
      </div>
    </div>
  );
}
