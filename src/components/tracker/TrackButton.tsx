'use client';

import { useState, useTransition } from 'react';
import { startTrackingShow } from '@/lib/tracker-actions';

interface TrackButtonProps {
  showId: string;
  showType?: 'tv' | 'movie';
}

export default function TrackButton({ showId, showType = 'tv' }: TrackButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [tracked, setTracked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = () => {
    startTransition(async () => {
      const res = await startTrackingShow(showId.toString(), showType);
      if (res.success) {
        setTracked(true);
        setError(null);
      } else {
        setError(res.error || 'Eklenirken bir hata oluştu');
      }
    });
  };

  if (tracked) {
    return (
      <button 
        disabled 
        className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-2 cursor-default transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Takip Ediliyor
      </button>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <button 
        onClick={handleTrack}
        disabled={isPending}
        className={`px-6 py-2.5 rounded-xl text-sm font-bold w-max flex items-center gap-2 transition-all ${
          isPending 
          ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed border border-indigo-500/30' 
          : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 border border-indigo-500'
        }`}
      >
        {isPending ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
        )}
        {isPending ? 'Ekleniyor...' : 'İzlemeye Başla'}
      </button>
      {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
    </div>
  );
}
