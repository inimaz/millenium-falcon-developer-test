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
