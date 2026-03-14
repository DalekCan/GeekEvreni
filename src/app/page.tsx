import { mockShows } from '@/lib/mockData';
import ShowCard from '@/components/ShowCard';

export default function Home() {
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

      {/* Dizi Listesi Gelecek Alan (Placeholder) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
        {mockShows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}
