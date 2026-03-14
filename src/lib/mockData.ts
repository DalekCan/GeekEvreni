export interface Show {
  id: string;
  title: string;
  poster_url: string;
  synopsis: string;
  seasons: number[];
}

export const mockShows: Show[] = [
  {
    id: "the-walking-dead-mock",
    title: "The Walking Dead",
    poster_url: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/n7PVu0hSz2sAs8ficXKUGQ6384C.jpg",
    synopsis: "Şerif Yardımcısı Rick Grimes komadan uyandığında dünyanın zombi kıyameti sonrası harabeye döndüğünü görür. Hayatta kalan bir grup insanla birlikte Georgia kırsalında güvenli bir sığınak arayışına, hayatta kalma mücadelesine girer.",
    seasons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    id: "doctor-who-mock",
    title: "Doctor Who",
    poster_url: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/4edFyasCrRxVN4nOMvIx6g5lWk2.jpg",
    synopsis: "Zaman ve uzayda yolculuk yapan, TARDIS adındaki bir uzay gemisiyle seyahat eden gizemli bir Zaman Lordu'nun, 'Doktor'un maceraları. Doktor ve yol arkadaşları, tarihin farklı dönemlerinde dünyayı kurtarır ve adaletsizlikle savaşır.",
    seasons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  }
];
