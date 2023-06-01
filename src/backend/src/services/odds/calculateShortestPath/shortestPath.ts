import { IGraph, ShortestPathResponse } from "../interfaces";
import PriorityQueue from "./priorityQueue.class";
export class ShortestPath {
  graph: IGraph;
  maxDistance: number;
  startNode: string;
  endNode: string;
  distances: any;
  previous: any;
  queue: PriorityQueue;
  hunterPresences: any;
  bounty_hunters: { planet: string; day: number }[];
  _shipAutonomy: number;
  maxHunters: number;

  constructor(
    graph: IGraph,
    startNode: string,
    endNode: string,
    bounty_hunters: { planet: string; day: number }[] = [],
    shipAutonomy?: number,
    maxDistance?: number,
    maxHunters?: number
  ) {
    ///////// SET UP /////////
    this.graph = graph;
    this.startNode = startNode;
    this.endNode = endNode;
    this.bounty_hunters = bounty_hunters;
    if (maxDistance) {
      this.maxDistance = maxDistance;
    } else {
      // If there is no max distance, we can take as many steps as we want
      this.maxDistance = Infinity;
    }
    if (typeof maxHunters !== "undefined") {
      this.maxHunters = maxHunters;
    } else {
      this.maxHunters = Infinity;
    }
    // Create an object to store the shortest distance to each node
    this.distances = {};
    // Create an object to store the previous node in the shortest path
    this.previous = {};
    // Create a priority queue to store nodes with their distances
    this.queue = new PriorityQueue();
    if (shipAutonomy) {
      this._shipAutonomy = shipAutonomy;
    } else {
      // If there is no ship autonomy, the ship can take any delta
      this._shipAutonomy = Infinity;
    }
    console.log(`Ship's autonomy: ${this._shipAutonomy}`);
    this.hunterPresences = {};
    // Initialize the distances and previous nodes
    for (const node in graph) {
      if (node === startNode) {
        this.distances[node] = 0;
        this.queue.enqueue(node, 0, 0, this._shipAutonomy, 0);
      } else {
        this.distances[node] = Infinity;
        this.queue.enqueue(node, Infinity, 0, this._shipAutonomy, 0);
      }
      this.previous[node] = null;
    }

    console.log("***** Setup done *****");
  }

  calculatePath(): ShortestPathResponse {
    console.log("Starting to calculate the shortest path");
    if (this.startNode == this.endNode) {
      console.log("The ship is already in the target");
      return { success: true, nCaptureTries: 0 };
    }
    // Traverse the graph
    while (!this.queue.isEmpty()) {
      // Get the first item of the queue and the distance from the previous node
      const currentNodeToExplore = this.queue.dequeue();
      console.log("Current node to explore:", currentNodeToExplore);
      const {
        planetName: currentNode,
        priority,
        currentFuel,
        nCaptureTries,
      } = currentNodeToExplore;

      if (currentNode === this.endNode) {
        if (nCaptureTries <= this.maxHunters) {
          // We have reached the end node, now we can reconstruct the shortest path
          return this._createResponse(nCaptureTries, priority);
        }
        console.log(
          "We have reached the end node but the nCaptureTries is higher than the one we wanted. We throw away this node"
        );
        continue;
      }

      if (currentNode || this.distances[currentNode] !== Infinity) {
        for (const neighbor in this.graph[currentNode]) {
          this._computeNeighborDistance(
            neighbor,
            currentNode,
            deepCopy(currentFuel),
            nCaptureTries
          );
        }
      } else {
        console.log(currentNode);
        console.log(this.distances[currentNode]);
      }
    }

    // If we reach this point, there is no path from startNode to endNode
    return { success: false, nCaptureTries: 0 };
  }
  refuel(currentNode: string): number {
    console.log("Refueling...");
    this.distances[currentNode] += 1;
    return deepCopy(this._shipAutonomy);
  }
  consumeFuel(currentFuel: number, distance: number): number {
    console.log(`Consuming ${distance} of fuel `);
    return currentFuel - distance;
  }
  /**
   * We know the shortest path, now we build the response (total distance, number of capture tries)
   * fpr that given path
   * @returns
   */
  _createResponse = (nCaptureTries: number, totalDistance: number) => {
    // We have reached the end node, so we can reconstruct the shortest path
    console.log("Reached endNode, calculating the path");
    //   console.log(previous);
    let path = [];
    let node = this.endNode;
    let previousNode;
    let success = true;
    while (node) {
      path.unshift(node);
      previousNode = this.previous[node];
      console.log(previousNode);
      console.log(path);
      node = previousNode;
    }
    if (!isFinite(totalDistance)) {
      // Set the path to empty
      path = [];
      success = false;
      totalDistance = 0;
    }
    return { success, path, distance: totalDistance, nCaptureTries };
  };
  /**
   * Calculates the distance to be added
   * @param distance
   * @param currentNode
   * @returns
   */
  _calculateDeltaDistance = (
    distance: number,
    totalDistance: number,
    currentNode: string,
    nCaptureTries: number
  ) => {
    const hunterPresence: boolean = this.bounty_hunters.some(
      (hunter) => hunter.day == totalDistance && hunter.planet == currentNode
    );
    let hunterPresenceDistance = 0;
    if (hunterPresence) {
      console.debug(
        `There is a hunter in planet ${currentNode} the day ${distance}`
      );

      hunterPresenceDistance =
        nCaptureTries + 1 <= this.maxHunters ? 0 : Infinity;
      console.debug("hunterPresenceDistance:", hunterPresenceDistance);
    }
    const deltaDistance = Math.sqrt(
      distance ** 2 + hunterPresenceDistance ** 2
    );
    console.debug("Delta distance:", deltaDistance);
    return { deltaDistance, hunterPresence };
  };
  _neighborDistanceAndDelta = (
    neighbor: string,
    currentNode: string,
    nCaptureTries: number
  ) => {
    const { deltaDistance: computedDeltaDistance, hunterPresence } =
      this._calculateDeltaDistance(
        this.graph[currentNode][neighbor],
        this.distances[currentNode],
        currentNode,
        nCaptureTries
      );
    const distance = this.distances[currentNode] + computedDeltaDistance;
    return { computedDeltaDistance, hunterPresence, distance };
  };

  /**
   * Perform all the actions to compute the neighbor distance and add it to the queue
   * @param neighbor
   * @param currentNode
   */
  _computeNeighborDistance(
    neighbor: string,
    currentNode: string,
    currentFuel: number,
    currentNCaptureTries: number
  ) {
    let { computedDeltaDistance, hunterPresence, distance } =
      this._neighborDistanceAndDelta(
        neighbor,
        currentNode,
        currentNCaptureTries
      );

    let isMovementNeeded = this._isMovementNeeded(
      distance,
      computedDeltaDistance,
      neighbor
    );
    // If the movement is needed but the fuel is not enough, refuel and recalculate distances
    if (isMovementNeeded && currentFuel < computedDeltaDistance) {
      currentFuel = this.refuel(currentNode);
      currentNCaptureTries += Number(hunterPresence);
      const response = this._neighborDistanceAndDelta(
        neighbor,
        currentNode,
        currentNCaptureTries
      );
      computedDeltaDistance = response.computedDeltaDistance;
      hunterPresence = response.hunterPresence;
      distance = response.distance;
      // We recalculate if the movement is still needed
      isMovementNeeded = this._isMovementNeeded(
        distance,
        computedDeltaDistance,
        neighbor
      );
    }

    if (isMovementNeeded) {
      // Consume fuel
      console.log(`Fuel: ${currentFuel}`);
      currentFuel = this.consumeFuel(currentFuel, computedDeltaDistance);
      // Found a shorter path to the neighbor
      // Add it to queue
      this.distances[neighbor] = distance;
      this.previous[neighbor] = currentNode;
      console.log("Current distances matrix:", this.distances);
      console.log("Current previous matrix:", this.previous);
      currentNCaptureTries += Number(hunterPresence);
      this.queue.enqueue(
        neighbor,
        distance,
        computedDeltaDistance,
        currentFuel,
        currentNCaptureTries
      );
    }
  }
  _isMovementNeeded = (
    totalDistance: number,
    deltaDistance: number,
    neighbor: string
  ): boolean => {
    return (
      totalDistance <= this.maxDistance &&
      totalDistance < this.distances[neighbor] &&
      deltaDistance <= this._shipAutonomy
    );
  };
}

/**
 * We need this deep copy function because JSON.stringify(Infinity) is not supported
 * @param value
 * @returns
 */
const deepCopy = (value: any) => {
  const newValue =
    value === Infinity ? Infinity : JSON.parse(JSON.stringify(value));
  return newValue;
};
