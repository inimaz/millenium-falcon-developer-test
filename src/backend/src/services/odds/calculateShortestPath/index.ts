import { IGraph, ShortestPathResponse } from "../interfaces";
import { ShortestPath } from "./shortestPath";

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
    "////////////////////// Calculate shortest path without avoiding hunters //////////////////////"
  );
  const shortPathsArray = [];
  const shortestPathCalculator = new ShortestPath(
    graph,
    startNode,
    endNode,
    bounty_hunters,
    autonomy,
    maxDistance,
    Infinity
  );
  const initialShortPath = shortestPathCalculator.calculatePath();
  console.log(`initialShortPath: `, initialShortPath);
  shortPathsArray.push({ ...initialShortPath, name: "initialShortPath" });
  if (!initialShortPath.success) {
    console.log("No luck, the falcon cannot reach the target planet on time.");
    return initialShortPath;
  }
  if (initialShortPath.nCaptureTries == 0) {
    // If capture tries is 0 --> this is the path
    return initialShortPath;
  }
  console.log(
    "////////////////////// Calculate shortest path avoiding hunters //////////////////////"
  );
  //
  const shortestPathCalculatorAvoidHunters = new ShortestPath(
    graph,
    startNode,
    endNode,
    bounty_hunters,
    autonomy,
    maxDistance,
    0
  );
  const shortPathAvoidingHunters =
    shortestPathCalculatorAvoidHunters.calculatePath();
  console.log(`shortestPathCalculatorAvoidHunters: `, shortPathAvoidingHunters);

  shortPathsArray.push({
    ...shortPathAvoidingHunters,
    name: "shortPathAvoidingHunters",
  });
  if (shortPathAvoidingHunters.success) {
    return shortPathAvoidingHunters;
  }

  // We cannot avoid hunters. Now we need to get dirty and go to planets where there are hunters
  const N = initialShortPath.nCaptureTries;
  let n = 1;
  while (n < N) {
    console.log(
      `////////////////////// Calculate shortest path allowing ${n} hunters //////////////////////`
    );
    // If capture tries is N --> try with maxcaptures = 1,2,3...N-1,N
    const shortestPathCalculator = new ShortestPath(
      graph,
      startNode,
      endNode,
      bounty_hunters,
      autonomy,
      maxDistance,
      n
    );
    const shortestPathResponse = shortestPathCalculator.calculatePath();
    const shortPathName = `shortestPath${n}`;
    console.log(shortPathName, shortestPathResponse);
    shortPathsArray.push({ ...shortestPathResponse, name: shortPathName });
    if (shortestPathResponse.success) {
      return shortestPathResponse;
    }
    n += 1;
  }
  console.log("All calculated paths", shortPathsArray);
  // Get the first success with the lowest N
  // If no other way is possible, return the initial shortPath
  return initialShortPath;
}
