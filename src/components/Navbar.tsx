import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 h-16 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Sol: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-xl tracking-tight text-white hover:text-slate-300 transition-colors">
              GeekEvreni
            </Link>
          </div>

          {/* Orta: Arama Çubuğu (Şimdilik Boş Div) */}
          <div className="flex-1 max-w-lg mx-8 hidden sm:block">
            <div className="w-full bg-slate-800 rounded-md h-10 border border-slate-700 flex items-center px-4 text-slate-400">
               {/* SearchBar bileşeni buraya gelecek */}
               <span>Ara...</span>
            </div>
          </div>

          {/* Sağ: Giriş Yap Butonu */}
          <div className="flex items-center">
            <button className="bg-slate-100 text-slate-900 px-4 py-2 rounded-md font-medium text-sm hover:bg-white transition-colors">
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
