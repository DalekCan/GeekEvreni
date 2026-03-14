import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CommentSection from '@/components/CommentSection';
import { mockShows } from '@/lib/mockData';
import { notFound } from 'next/navigation';

export default async function SeasonRoomPage({ params }: { params: Promise<{ id: string, seasonNumber: string }> }) {
  const resolvedParams = await params;
  const show = mockShows.find(s => s.id === resolvedParams.id);
  
  // Show bulunamadıysa veya o sezona (ya undefined ya da farklı) denk gelen yoksa (şimdilik sadece id'ye göre basit kontrol)
  if (!show) {
    notFound();
  }

  // Sezon mocklarda varsa bulalım ama yoksa da genel olarak renderlayabiliriz, sorun değil.
  
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      {/* Header Alanı */}
      <div className="bg-slate-900 border-b border-slate-800 pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link 
              href={`/show/${show.id}`}
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Diziye Dön
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            <span className="text-slate-400 font-medium">Tartışma Odası: </span>  
            {show.title} - {resolvedParams.seasonNumber}. Sezon
          </h1>
          <p className="mt-4 text-slate-400 md:text-lg">
            Bu odada sadece <span className="font-semibold text-slate-200">{resolvedParams.seasonNumber}. Sezon</span> ile alakalı konuşulmaktadır. İleriki sezonlardan spoiler vermek kesinlikle yasaktır ve ban sebebidir!
          </p>
        </div>
      </div>

      {/* Yorum Alanı */}
      <main className="px-4 sm:px-6 lg:px-8 pb-20">
        <CommentSection />
      </main>
    </div>
  );
}
