import { notFound } from 'next/navigation';
import { getEpisodeDetails, getShowDetails } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';

export default async function EpisodePage({ 
  params 
}: { 
  params: Promise<{ id: string, seasonNumber: string, episodeNumber: string }> 
}) {
  const resolvedParams = await params;
  const { id, seasonNumber, episodeNumber } = resolvedParams;

  const [show, episode] = await Promise.all([
    getShowDetails(id),
    getEpisodeDetails(id, seasonNumber, episodeNumber)
  ]);

  if (!show || !episode) {
    notFound();
  }

  const showTitle = show.name || show.title || 'İsimsiz Dizi';
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
  const stillUrl = episode.still_path ? `${TMDB_IMAGE_BASE}${episode.still_path}` : null;
  const showPosterUrl = show.backdrop_path ? `${TMDB_IMAGE_BASE}${show.backdrop_path}` : null;
  const bannerImage = stillUrl || showPosterUrl;

  const formattedDate = episode.air_date 
    ? new Date(episode.air_date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Banner / Header */}
      <div className="relative w-full h-[40vh] md:h-[50vh] xl:h-[60vh] flex items-end">
        {bannerImage && (
          <Image 
            src={bannerImage} 
            alt={episode.name || 'Bölüm Görseli'} 
            fill 
            className="object-cover object-top opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex flex-col gap-2">
            <Link 
              href={`/show/${id}`} 
              className="text-indigo-400 font-bold text-sm sm:text-base hover:text-indigo-300 transition-colors flex items-center gap-1.5 w-max"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              {showTitle}
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg">
              {episode.name || 'İsimsiz Bölüm'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 font-medium text-sm sm:text-base mt-2">
              <span className="px-3 py-1 bg-slate-800/80 border border-slate-700/50 rounded-lg">
                Sezon {seasonNumber} • Bölüm {episodeNumber}
              </span>
              {formattedDate && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700/50 rounded-lg text-indigo-200">
                  <span className="text-lg leading-none">🗓️</span>
                  <span>{formattedDate}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Sol Kolon: Açıklama ve Detaylar */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              Bölüm Özeti
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-10">
              {episode.overview || 'Bu bölüm için henüz detaylı bir Türkçe özet girilmemiş. Heyecan verici içerikler dizinin kendi akışında saklı olabilir.'}
            </p>

            {/* İzole Spoiler ve Puanlama Placeholder'ı */}
            <div className="mt-16 bg-slate-800/20 border-2 border-dashed border-slate-700/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg className="w-16 h-16 text-slate-600 mb-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path></svg>
              <h3 className="text-2xl font-black text-slate-300 mb-2">Spoiler Korumalı Tartışma Odası</h3>
              <p className="text-slate-500 max-w-md font-medium">Bölümü izledin mi? Topluluk oylaması ve spoiler fırtınası çok yakında bu alanda kopacak.</p>
            </div>
          </div>

          {/* Sağ Kolon: Ekstra minik datalar (Süre, Yönetmen) veya Reklam/Öneri alanı */}
          <div className="hidden lg:block">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sticky top-24">
               <h3 className="text-slate-100 font-bold text-lg mb-4">Bölüm Bilgileri</h3>
               <div className="space-y-4">
                 <div>
                   <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Süre</p>
                   <p className="text-slate-300 font-medium">{episode.runtime ? `${episode.runtime} Dakika` : 'Bilinmiyor'}</p>
                 </div>
                 {episode.vote_average > 0 && (
                   <div>
                     <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">TMDB Puanı</p>
                     <div className="flex items-center gap-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-slate-300 font-medium">{(episode.vote_average/1).toFixed(1)} / 10</span>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
