import { Show } from '@/types';
import ShowCard from '@/components/ShowCard';
import { getPopularShows, getGenres, getShowsByGenre, getNewShows, getCompletedShows, getShowDetails } from '@/lib/tmdb';
import Pagination from '@/components/Pagination';
import CategoryRibbon from '@/components/CategoryRibbon';
import { createServerSupabase } from '@/lib/supabase-server';
import UpNextCard from '@/components/tracker/UpNextCard';
import { getUserUpNext } from '@/lib/tracker';

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string; genre?: string; filter?: string; format?: 'tv' | 'movie' | 'anime' }> }) {
  // Arama parametrelerini NextJs app router (server component) için asenkron yakalama
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const genre = resolvedParams.genre;
  const filter = resolvedParams.filter;
  const format = resolvedParams.format || 'tv';
  
  // Oturum Kontrolü (User Session) — Supabase erişilemezse sayfa yine de açılır
  let user = null;
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    // Supabase bağlantı hatası — giriş yapılmamış gibi devam eder
  }

  // 1. Kategorileri Çek (Anime ise şimdilik tv türlerini getiriyoruz)
  const apiFormat = format === 'anime' ? 'tv' : format;
  const genres = await getGenres(apiFormat);

  // 2. Seçili Kategori, Format veya Filtreye Göre İçerikleri Çek
  let shows: Show[] = [];
  
  if (filter === 'new') {
    shows = await getNewShows(format, page);
  } else if (filter === 'completed') {
    shows = await getCompletedShows(format, page);
  } else if (genre) {
    shows = await getShowsByGenre(format, genre, page);
  } else {
    shows = await getPopularShows(format, page);
  }

  // 3. İzleme Takip (Up Next) Gerçek Veri Entegrasyonu
  let upNextList: any[] = [];
  if (user) {
    const trackerData = await getUserUpNext();
    if (trackerData.length > 0) {
      // Her bir dizi için TMDB'den detay al ve birleştir
      const enrichedData = await Promise.all(
        trackerData.map(async (item) => {
          const detail = await getShowDetails(item.show_id);
          if (!detail) return null;
          
          const title = detail.name || detail.title || 'İsimsiz';
          // Sezon/Bölüm adını yazdıracak TMDB endpoint'i /tv/{id}/season/{num}/episode/{num} çekilebilir
          // Şimdilik performans gereği sezon numarasını doğrudan yazdırıyoruz
          const s = item.last_watched_season || 1;
          const lastEp = item.last_watched_episode !== null ? item.last_watched_episode : 0;
          const nextEp = lastEp + 1;
          
          return {
            id: item.show_id,
            showType: item.show_type,
            season: s,
            episode: nextEp,
            showName: title,
            episodeCode: `S${String(s).padStart(2,'0')}E${String(nextEp).padStart(2,'0')}`,
            episodeName: 'Sonrakini İzle', // Gelecekte bölüm adı da çekilebilir
            imageUrl: detail.poster_path ? `https://image.tmdb.org/t/p/w200${detail.poster_path}` : ''
          };
        })
      );
      upNextList = enrichedData.filter(Boolean);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Popüler Sezonlar ve Tartışmalar
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Aradığın diziyi bul, sevdiğin sezonların derinliklerine in ve toplulukla teorilerini paylaş.
        </p>
      </div>

      {/* İzleme Takip (Up Next) Alanı - Sadece Giriş Yapanlara */}
      {user && (
        <div className="mb-10 w-full overflow-hidden">
          <h2 className="text-xl font-bold text-white mb-4 px-2 border-l-4 border-indigo-500">
            Sıradaki Bölümlerin
          </h2>
          {upNextList.length > 0 ? (
            <div className="flex overflow-x-auto gap-3 pb-4 hide-scrollbar snap-x">
              {upNextList.map((item) => (
                <UpNextCard 
                  key={item.id}
                  id={item.id}
                  showType={item.showType}
                  season={item.season}
                  episode={item.episode}
                  showName={item.showName}
                  episodeCode={item.episodeCode}
                  episodeName={item.episodeName}
                  imageUrl={item.imageUrl}
                />
              ))}
            </div>
          ) : (
             <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-slate-400 font-medium mb-2">Henüz bir dizi takibine başlamadın.</p>
                <p className="text-sm text-slate-500">Aşağıdan bir dizi seç ve "İzlemeye Başla" diyerek serüvenine ortak ol!</p>
             </div>
          )}
        </div>
      )}

      {/* Dinamik Kategori Çubuğu */}
      <CategoryRibbon genres={genres} />

      {/* Dizi Listesi Gelecek Alan (Placeholder) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {shows.length > 0 ? (
          shows.map((show) => <ShowCard key={show.id} show={show} />)
        ) : (
          <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-700 rounded-2xl">
            <p className="text-slate-400 font-medium">İçerikler Yükleniyor veya Henüz Eklenmemiş...</p>
          </div>
        )}
      </div>

      {/* Sayfalama (Pagination) Modülü */}
      {shows.length > 0 && <Pagination currentPage={page} />}
    </div>
  );
}
