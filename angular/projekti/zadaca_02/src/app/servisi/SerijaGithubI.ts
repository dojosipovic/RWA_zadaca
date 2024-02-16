export interface SerijaGithubI {
  homepage: string;
  id: number;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  seasons: Array<SezonaGithubI>;
  vote_average: number;
  vote_count: number;
}

export interface SezonaGithubI {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}
