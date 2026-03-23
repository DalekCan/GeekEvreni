import { searchTrending } from '@/lib/tmdb';
import ShowCard from '@/components/ShowCard';
import Pagination from '@/components/Pagination';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; type?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const page = parseInt(resolvedParams.page || '1', 10);
  const type = resolvedParams.type || 'all';

  // Eğer arama terimi yoksa boş dönecek. type 'all' değilse süzgece gönder.
  const filterType = type !== 'all' ? type : undefined;
  const results = await searchTrending(query, page, filterType);

  return (
    <div className="min-h-screen bg-slate-900 border-t border-slate-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Başlık Alanı */}
        <div className="mb-12 border-b border-slate-800 pb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {query ? (
                  <>
                    "<span className="text-indigo-400">{query}</span>" için arama sonuçları
                  </>
                ) : (
                  "Ne aramak istersin?"
                )}
              </h1>
              <p className="text-slate-400 mt-1 font-medium flex items-center gap-2">
                Bütün dizi, film ve animelerde aranıyor.
                {type !== 'all' && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs border border-slate-700">
                    Filtre: {type}
                  </span>
                )}
              </p>
            </div>
        </div>

        {/* Sonuç Grid Alanı */}
        {query ? (
          results.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {results.map((show: any) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
              <Pagination currentPage={page} />
            </>
          ) : (
            /* Bulunamadı (Empty State) */
            <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-800/30 rounded-3xl border border-slate-800 border-dashed">
              <svg className="w-20 h-20 text-slate-600 mb-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="m8 11 2 2 4-4"/></svg>
              <h2 className="text-2xl font-bold text-slate-300 mb-2">Maalesef sonuç bulunamadı.</h2>
              <p className="text-slate-500 max-w-md">"{query}" terimiyle eşleşen dizi, film veya anime bulamadık. Lütfen farklı kelimelerle tekrar deneyin.</p>
            </div>
          )
        ) : (
          /* Kelime Yok (Empty State) */
          <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-800/30 rounded-3xl border border-slate-800 border-dashed">
              <svg className="w-20 h-20 text-slate-600 mb-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
              <h2 className="text-2xl font-bold text-slate-300 mb-2">Aramak için kelime yazın.</h2>
              <p className="text-slate-500 max-w-md">Yukarıdaki arama çubuğunu kullanarak sınırsız popüler içeriğin derinliklerine inebilirsiniz.</p>
          </div>
        )}

      </main>
    </div>
  );
}
