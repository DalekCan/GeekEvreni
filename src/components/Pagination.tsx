'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ currentPage, totalPages = 500 }: { currentPage: number, totalPages?: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
  
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = 5;
      }
      
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-16 mb-8 text-sm font-medium">
      {/* Önceki Butonu */}
      {currentPage > 1 ? (
        <Link 
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
        >
          Önceki
        </Link>
      ) : (
        <button disabled className="px-4 py-2 bg-slate-800/50 text-slate-500 rounded-lg border border-slate-800 cursor-not-allowed">
          Önceki
        </button>
      )}

      {/* Sayfa Numaraları */}
      <div className="flex gap-1">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-500">
                ...
              </span>
            );
          }
          
          const isActive = page === currentPage;
          return (
            <Link 
              key={`page-${page}`}
              href={createPageUrl(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${
                isActive 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Sonraki Butonu */}
      {currentPage < totalPages ? (
        <Link 
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
        >
          Sonraki
        </Link>
      ) : (
        <button disabled className="px-4 py-2 bg-slate-800/50 text-slate-500 rounded-lg border border-slate-800 cursor-not-allowed">
          Sonraki
        </button>
      )}
    </div>
  );
}
