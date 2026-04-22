import Link from 'next/link';
import { getShowDetails } from '@/lib/tmdb';
import { notFound } from 'next/navigation';

export default async function ForumRoomPage({ params }: { params: Promise<{ id: string, topic: string }> }) {
  const resolvedParams = await params;
  
  // Dizi detaylarını TMDB'den çek
  const show = await getShowDetails(resolvedParams.id);
  
  // Dizi bulunamadıysa (veya hatalı id ise)
  if (!show) {
    notFound();
  }

  // TMDB'de dizinin isim bilgisi "name" olarak döndüğü için title yedeğini destekliyoruz.
  const displayTitle = show.name || show.title || 'İsimsiz Dizi';
  const showId = show.id || resolvedParams.id;
  
  const topicNames: Record<string, string> = {
    'genel': 'Genel',
    'teoriler': 'Teoriler',
    'haberler': 'Haberler'
  };

  const topicName = topicNames[resolvedParams.topic] || resolvedParams.topic;
  
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      
      {/* Header Alanı */}
      <div className="bg-slate-900 border-b border-slate-800 pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link 
              href={`/show/${showId}`}
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Diziye Dön
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            <span className="text-slate-400 font-medium">Forum Odası: </span>  
            {displayTitle} - {topicName}
          </h1>
          <p className="mt-4 text-slate-400 md:text-lg">
            Bu odada <span className="font-semibold text-slate-200">{displayTitle}</span> dizisi hakkında <span className="font-semibold text-slate-200">{topicName.toLowerCase()}</span> tartışılmaktadır. Lütfen kurallara uygun davranın!
          </p>
        </div>
      </div>

      {/* Gelecek Yorum Alanı Yer Tutucusu */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/50">
        <div className="border-2 border-dashed border-slate-700/50 rounded-3xl p-12 max-w-2xl w-full flex flex-col items-center justify-center shadow-lg bg-slate-800/20">
          <svg className="w-16 h-16 text-indigo-500/50 mb-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 11h.01"/><path d="M8 11h.01"/><path d="M16 11h.01"/></svg>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Çok yakında tartışmalar burada olacak...</h2>
          <p className="text-slate-400">Yorum ve forum altyapısı hazırlanıyor. Hazır olduğunda burada harika fikirler paylaşabileceksin.</p>
        </div>
      </main>
    </div>
  );
}
