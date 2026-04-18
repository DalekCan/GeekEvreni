/**
 * TMDB API Configuration and Skeleton Setup
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;

// API istekleri atarken ortak olarak kullanılacak headers objesi
const getAuthHeaders = (): HeadersInit => {
  if (TMDB_ACCESS_TOKEN) {
    return {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    };
  }
  return {
    accept: 'application/json',
  };
};

/**
 * TMDB'den veri çekmek için taslak fonksiyon
 * @param endpoint - API ucu, örn: '/tv/popular'
 * @param params - Ek sorgu parametreleri, örn: '?language=tr-TR'
 */
export async function fetchFromTMDB(endpoint: string, params: string = '') {
  if (!TMDB_API_KEY && !TMDB_ACCESS_TOKEN) {
    console.warn('TMDB API Key veya Access Token bulunamadı. Lütfen .env.local dosyanızı kontrol edin.');
    // Şimdilik mock data dönecek şekilde ayarlanabilir veya throw edilebilir.
    return null;
  }

  // Eğer token yoksa fallback olarak query'ye api_key eklenir.
  const authQuery = TMDB_ACCESS_TOKEN ? '' : (params.includes('?') ? `&api_key=${TMDB_API_KEY}` : `?api_key=${TMDB_API_KEY}`);
  const url = `${TMDB_BASE_URL}${endpoint}${params}${authQuery}`;

  try {
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) {
        throw new Error(`TMDB fetch error: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('TMDB Data Fetch Error:', error);
    return null;
  }
}

/**
 * TMDB'den popüler içerikleri çeker.
 */
export async function getPopularShows(type: 'tv' | 'movie' | 'anime' = 'tv', page: number = 1) {
  try {
    if (type === 'anime') {
      const data = await fetchFromTMDB('/discover/tv', `?language=tr-TR&page=${page}&with_genres=16&with_origin_country=JP&sort_by=popularity.desc`);
      return data?.results || [];
    }
    const data = await fetchFromTMDB(`/${type}/popular`, `?language=tr-TR&page=${page}`);
    if (!data || !data.results) {
      return [];
    }
    return data.results;
  } catch (error) {
    console.error(`Failed to fetch popular ${type}s:`, error);
    return [];
  }
}

/**
 * TMDB'den belirli bir dizinin detaylarını çeker.
 */
export async function getShowDetails(id: string) {
  try {
    const data = await fetchFromTMDB(`/tv/${id}`, '?language=tr-TR');
    if (!data || data.success === false) {
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Failed to fetch show details for ID ${id}:`, error);
    return null;
  }
}

/**
 * TMDB'den dizi ve sinema araması yapar. İsteğe bağlı filtreleme seçeneği eklidir.
 */
export async function searchTrending(query: string, page: number = 1, filterType?: string) {
  if (!query) return [];
  
  try {
    const data = await fetchFromTMDB('/search/multi', `?query=${encodeURIComponent(query)}&language=tr-TR&page=${page}`);
    if (!data || !data.results) {
      return [];
    }
    
    // Gelen sonuçları (kişiler çıkmasın diye tv/movie) ana olarak süz
    let results = data.results.filter(
      (item: any) => item.media_type === 'tv' || item.media_type === 'movie'
    );

    // FilterType'a göre ikinci süzgeç (Eğer filtre uygulandıysa)
    if (filterType) {
      if (filterType === 'tv') {
        results = results.filter((item: any) => item.media_type === 'tv');
      } else if (filterType === 'movie') {
        results = results.filter((item: any) => item.media_type === 'movie');
      } else if (filterType === 'documentary') {
        // Belgesel ID'si 99
        results = results.filter((item: any) => item.genre_ids && item.genre_ids.includes(99));
      } else if (filterType === 'anime') {
        // Animasyon ID: 16 ve Origin Country: JP
        results = results.filter(
          (item: any) => 
            item.media_type === 'tv' && 
            item.genre_ids && 
            item.genre_ids.includes(16) &&
            item.origin_country && 
            item.origin_country.includes('JP')
        );
      }
    }

    return results;
  } catch (error) {
    console.error(`Search failed for ${query}:`, error);
    return [];
  }
}

/**
 * TMDB'den dizi ve sinema türlerini (kategorilerini) çeker.
 */
export async function getGenres(type: 'tv' | 'movie' = 'tv') {
  try {
    const data = await fetchFromTMDB(`/genre/${type}/list`, '?language=tr-TR');
    if (!data || !data.genres) {
      return [];
    }
    return data.genres;
  } catch (error) {
    console.error(`Failed to fetch ${type} genres:`, error);
    return [];
  }
}

/**
 * Belirli bir türe göre (Sci-Fi, Dram vb.) populer içerikleri çeker.
 */
export async function getShowsByGenre(type: 'tv' | 'movie' | 'anime' = 'tv', genreId: string, page: number = 1) {
  try {
    if (type === 'anime') {
      const data = await fetchFromTMDB('/discover/tv', `?language=tr-TR&page=${page}&with_genres=16,${genreId}&with_origin_country=JP&sort_by=popularity.desc`);
      return data?.results || [];
    }
    const data = await fetchFromTMDB(`/discover/${type}`, `?language=tr-TR&page=${page}&with_genres=${genreId}&sort_by=popularity.desc`);
    if (!data || !data.results) {
      return [];
    }
    return data.results;
  } catch (error) {
    console.error(`Failed to fetch shows for genre ${genreId}:`, error);
    return [];
  }
}

/**
 * Anime kategorisi TMDB'de Animation(16) türü ve Japon(JP) ülkesi filtresiyle oluşur.
 */
export async function getAnimeShows(page: number = 1) {
  try {
    const data = await fetchFromTMDB('/discover/tv', `?language=tr-TR&page=${page}&with_genres=16&with_origin_country=JP&sort_by=popularity.desc`);
    if (!data || !data.results) {
      return [];
    }
    return data.results;
  } catch (error) {
    console.error("Failed to fetch anime shows:", error);
    return [];
  }
}

/**
 * Yayını devam eden veya yeni bölümleri/filmleri gelen içerikleri çeker.
 */
export async function getNewShows(type: 'tv' | 'movie' | 'anime' = 'tv', page: number = 1) {
  try {
    if (type === 'anime') {
      // Son 3 ayda çıkmış veya şu an popüler olan yeni animeleri keşfetmek için.
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const dateStr = threeMonthsAgo.toISOString().split('T')[0];
      const data = await fetchFromTMDB('/discover/tv', `?language=tr-TR&page=${page}&with_genres=16&with_origin_country=JP&first_air_date.gte=${dateStr}&sort_by=popularity.desc`);
      return data?.results || [];
    }
    // TV için 'on_the_air', Movie için 'now_playing' kullanılır.
    const endpoint = type === 'tv' ? '/tv/on_the_air' : '/movie/now_playing';
    const data = await fetchFromTMDB(endpoint, `?language=tr-TR&page=${page}`);
    if (!data || !data.results) {
      return [];
    }
    return data.results;
  } catch (error) {
    console.error(`Failed to fetch new ${type}s:`, error);
    return [];
  }
}

/**
 * Bitmiş (final yapmış) veya eskiden çıkmış içerikleri çeker.
 */
export async function getCompletedShows(type: 'tv' | 'movie' | 'anime' = 'tv', page: number = 1) {
  try {
    if (type === 'anime') {
      const data = await fetchFromTMDB('/discover/tv', `?language=tr-TR&page=${page}&with_genres=16&with_origin_country=JP&with_status=3&sort_by=popularity.desc`);
      return data?.results || [];
    }
    
    // TV için 'with_status=3' (Ended). Filmler için vizyondan kalkmış eski filmler (Örn: Revenue olanlar veya geçmiş tarihli)
    // Filmler için bitmiş kavramı tam uymadığı için geçmiş yılların popülerlerini çekebiliriz.
    const query = type === 'tv' 
      ? `?language=tr-TR&page=${page}&with_status=3&sort_by=popularity.desc`
      : `?language=tr-TR&page=${page}&primary_release_date.lte=${new Date().toISOString().split('T')[0]}&sort_by=popularity.desc`;
      
    const data = await fetchFromTMDB(`/discover/${type}`, query);
    if (!data || !data.results) {
      return [];
    }
    return data.results;
  } catch (error) {
    console.error(`Failed to fetch completed ${type}s:`, error);
    return [];
  }
}

/**
 * Belirli bir dizi veya filmin oyuncu kadrosunu (Cast) çeker.
 */
export async function getCredits(id: string, type: 'tv' | 'movie' = 'tv') {
  try {
    const data = await fetchFromTMDB(`/${type}/${id}/credits`, '?language=tr-TR');
    if (!data || !data.cast) {
      return [];
    }
    return data.cast;
  } catch (error) {
    console.error(`Failed to fetch credits for ${type} ID ${id}:`, error);
    return [];
  }
}

/**
 * Belirli bir dizinin spesifik bir bölümünün detaylarını çeker.
 */
export async function getEpisodeDetails(showId: string, seasonNumber: string | number, episodeNumber: string | number) {
  try {
    const data = await fetchFromTMDB(`/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`, '?language=tr-TR');
    if (!data || data.success === false) {
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Failed to fetch episode details for Show ${showId} S${seasonNumber}E${episodeNumber}:`, error);
    return null;
  }
}
