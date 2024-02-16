export interface SerijeTmdbI {
  page: number;
  results: Array<SerijaTmdbI>;
  total_pages: number;
  total_results: number;
}
export interface SerijaTmdbI {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  title: string;
  homepage: string;
  number_of_seasons: number;
  number_of_episodes: number;
  popularity: number;
}
