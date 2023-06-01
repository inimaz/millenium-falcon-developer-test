import { IGraph, ShortestPathResponse } from '../interfaces';
import { ShortestPath } from './shortestPath';

export function shortestPathLogic(
  graph: IGraph,
  startNode: string,
  endNode: string,
  bounty_hunters: { planet: string; day: number }[] = [],
  autonomy: number,
  maxDistance: number
): ShortestPathResponse {
  // Get the shortest path and the number of capture tries
  console.log(
    '////////////////////// Calculate shortest path without avoiding hunters //////////////////////'
  );
  const shortestPathCalculator = new ShortestPath(
    graph,
    startNode,
    endNode,
    true,
    bounty_hunters,
    autonomy,
    maxDistance
  );
  const shortPath = shortestPathCalculator.calculatePath();
  if (!shortPath.success) {
    console.log('No luck, the falcon cannot reach the target planet on time.');
    return shortPath;
  }
  if (shortPath.nCaptureTries == 0) {
    // If capture tries is 0 --> this is the path
    return shortPath;
  }
  console.log(
    '////////////////////// Calculate shortest path avoiding hunters //////////////////////'
  );
  //
  const shortestPathCalculatorAvoidHunters = new ShortestPath(
    graph,
    startNode,
    endNode,
    false,
    bounty_hunters,
    autonomy,
    maxDistance
  );
  const shortPathAvoidingHunters =
    shortestPathCalculatorAvoidHunters.calculatePath();
  if (shortPathAvoidingHunters.success) {
    return shortPathAvoidingHunters;
  }

  // We cannot avoid hunters. Now we need to get dirty and go to planets where there are hunters
  const N = shortPath.nCaptureTries;
  let n = 1;
  while (n < N) {
    // If capture tries is N --> try with maxcaptures = 1,2,3...N-1,N
    n += 1;
  }
  // Get the first success with the lowest N
  return shortPath;
}
