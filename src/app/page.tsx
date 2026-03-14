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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Örnek Kartlar (Veritabanı bağlandığında dinamik olacak) */}
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer group">
            <div className="aspect-[2/3] bg-slate-700 relative flex items-center justify-center">
              <span className="text-slate-500">Afiş Gelecek</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white text-lg truncate group-hover:text-indigo-400 transition-colors">
                Yükleniyor...
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Sezon ve tartışma verileri eklenecek.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
