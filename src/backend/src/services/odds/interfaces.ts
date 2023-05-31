export interface IGraph {
  [key: string]: { [key: string]: number };
}

export interface CreateOddsResponse {
  odds: number;
}

export interface CreateOddsInputData {
  countdown: number;
  bounty_hunters: { planet: string; day: number }[];
}

export interface ShortestPathResponse {
  success: boolean;
  path?: string[];
  distance?: number;
  nCaptureTries: number;
}

export interface IMilleniumFalconConfig {
  autonomy: number;
  departure: string;
  arrival: string;
  routes_db: string;
}
