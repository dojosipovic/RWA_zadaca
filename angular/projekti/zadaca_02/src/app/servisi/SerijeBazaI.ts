export interface SerijeBazaI {
  br_epizoda: number;
  br_sezona: number;
  broj_glasova: number;
  naziv: string;
  opis: string;
  originalni_jezik: string;
  originalno_ime: string;
  popularnost: number;
  prosjecno_glasovi: number;
  slika: string;
  stranica: string;
  tip: string;
  tmdb_id: number;
  tmdb_id_serije: number;
  sezone: Array<SezoneBazaI>;
}

export interface SezoneBazaI {
  br_epizoda: number;
  br_sezone: number;
  naziv: string;
  opis: string;
  prosjecno_glasovi: number;
  serija_tmdb_id: number;
  slika: string;
  tmdb_id: number;
}
