'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import Image from 'next/image';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || 'all';
  
  const [text, setText] = useState(queryParam);
  const [filterType, setFilterType] = useState(typeParam);
  const [debouncedValue] = useDebounce(text, 300);

  // Canlı (Auto-suggest) öneriler
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklanınca önerileri gizle
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced input değiştiğinde ve popup açıksa canlı suggestions çek
  useEffect(() => {
    async function fetchSuggestions() {
      if (!debouncedValue.trim()) {
        setSuggestions([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const url = `/api/search-suggest?q=${encodeURIComponent(debouncedValue)}` + (filterType !== 'all' ? `&type=${filterType}` : '');
        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(data.results.slice(0, 3)); // Sadece ilk 3 tanesini göster
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setIsSearching(false);
      }
    }

    if (showSuggestions) {
      fetchSuggestions();
    }
  }, [debouncedValue, filterType, showSuggestions]);

  // Ana aramayı tetikle (Enter / Submit)
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    
    if (text.trim() === '') {
      router.push('/');
    } else {
      const typeQuery = filterType !== 'all' ? `&type=${filterType}` : '';
      router.push(`/search?q=${encodeURIComponent(text.trim())}${typeQuery}`);
    }
  };

  // Sayfa dışarıdan değiştiğinde select/input senkronize et
  useEffect(() => {
    setText(queryParam);
    setFilterType(typeParam);
  }, [queryParam, typeParam]);

  return (
    <div className="relative w-full z-50" ref={searchContainerRef}>
      <form onSubmit={handleSubmit} className="flex relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Filtre (Select Menüsü) */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-800 border-y border-l border-slate-700 rounded-l-lg py-2 pl-9 pr-6 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 border-r-0 cursor-pointer"
        >
          <option value="all">Filtresiz</option>
          <option value="tv">Diziler</option>
          <option value="movie">Filmler</option>
          <option value="anime">Animeler</option>
          <option value="documentary">Belgesel</option>
        </select>

        {/* Arama Inputu */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
             setText(e.target.value);
             setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="block w-full px-3 py-2 border border-slate-700 rounded-r-lg bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-700/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors border-l-slate-700"
          placeholder="Ara..."
        />

        {text && (
          <button 
            type="button"
            onClick={() => {
              setText('');
              setShowSuggestions(false);
              router.push('/');
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </form>

      {/* Öneriler (Auto-suggest Dropdown) */}
      {showSuggestions && text.trim().length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
          {isSearching ? (
            <div className="p-4 text-center text-sm text-slate-400 animate-pulse">
               Öneriler aranıyor...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-[80vh] overflow-y-auto">
              {suggestions.map((item) => (
                <li key={item.id} className="border-b border-slate-700 last:border-0">
                  <button
                    onClick={() => {
                      setShowSuggestions(false);
                      router.push(`/show/${item.id}`);
                    }}
                    className="w-full text-left p-3 hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
                  >
                    {item.poster_path ? (
                      <div className="relative w-10 h-14 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={item.name || item.title || 'Afiş'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-14 bg-slate-700 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">
                        {item.name?.charAt(0) || item.title?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {item.name || item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {item.media_type === 'tv' ? 'Dizi' : 'Film'}
                        {item.first_air_date && ` • ${item.first_air_date.substring(0, 4)}`}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
              <li className="bg-slate-900/50 hover:bg-slate-900">
                <button
                  onClick={() => handleSubmit()}
                  className="w-full text-center text-xs font-semibold text-indigo-400 p-3 transition-colors"
                >
                  Tüm "{text}" sonuçlarını tam sayfada gör &rarr;
                </button>
              </li>
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-slate-400">
              Bu terime uygun bir öneri çıkmadı.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
