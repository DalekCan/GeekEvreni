import { Show } from '@/types';
import ShowCard from '@/components/ShowCard';
import { getPopularShows, getGenres, getShowsByGenre, getNewShows, getCompletedShows } from '@/lib/tmdb';
import Pagination from '@/components/Pagination';
import CategoryRibbon from '@/components/CategoryRibbon';

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string; genre?: string; filter?: string; format?: 'tv' | 'movie' | 'anime' }> }) {
  // Arama parametrelerini NextJs app router (server component) için asenkron yakalama
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const genre = resolvedParams.genre;
  const filter = resolvedParams.filter;
  const format = resolvedParams.format || 'tv';
  
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Popüler Sezonlar ve Tartışmalar
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Aradığın diziyi bul, sevdiğin sezonların derinliklerine in ve toplulukla teorilerini paylaş.
        </p>
      </div>

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
