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
  ignoreHunters: boolean;

  constructor(
    graph: IGraph,
    startNode: string,
    endNode: string,
    ignoreHunters = true,
    bounty_hunters: { planet: string; day: number }[] = [],
    maxDistance?: number
  ) {
    ///////// SET UP /////////
    this.graph = graph;
    this.startNode = startNode;
    this.endNode = endNode;
    this.bounty_hunters = bounty_hunters;
    this.ignoreHunters = ignoreHunters;
    if (maxDistance) {
      this.maxDistance = maxDistance;
    } else {
      // If there is no max distance, we can take as many steps as we want
      this.maxDistance = Infinity;
    }
    // Create an object to store the shortest distance to each node
    this.distances = {};
    // Create an object to store the previous node in the shortest path
    this.previous = {};
    // Create a priority queue to store nodes with their distances
    this.queue = new PriorityQueue();
    this.hunterPresences = {};
    // Initialize the distances and previous nodes
    for (const node in graph) {
      if (node === startNode) {
        this.distances[node] = 0;
        this.queue.enqueue(node, 0);
      } else {
        this.distances[node] = Infinity;
        this.queue.enqueue(node, Infinity);
      }
      this.previous[node] = null;
    }

    console.log("Setup done");
  }

  calculatePath(): ShortestPathResponse {
    console.log("Starting to calculate the shortest path");
    if (this.startNode == this.endNode) {
      console.log("The ship is already in the target");
      return { success: true, nCaptureTries: 0 };
    }
    // Traverse the graph
    while (!this.queue.isEmpty()) {
      const currentNode = this.queue.dequeue();
      // console.log("CurrentNode:", currentNode);

      if (currentNode === this.endNode) {
        // We have reached the end node, so we can reconstruct the shortest path
        return this._createResponse();
      }

      if (currentNode || this.distances[currentNode] !== Infinity) {
        for (const neighbor in this.graph[currentNode]) {
          const { newDistance: computedNewDistance, hunterPresence } =
            this._calculateNewDistance(
              this.graph[currentNode][neighbor],
              currentNode
            );
          const distance = this.distances[currentNode] + computedNewDistance;

          if (
            distance <= this.maxDistance &&
            distance < this.distances[neighbor]
          ) {
            // Found a shorter path to the neighbor
            this.distances[neighbor] = distance;
            this.previous[neighbor] = currentNode;
            this.hunterPresences[neighbor] = hunterPresence;
            this.queue.enqueue(neighbor, distance);
          }
        }
      }
    }

    // If we reach this point, there is no path from startNode to endNode
    return { success: false, nCaptureTries: 0 };
  }
  /**
   * We know the shortest path, now we build the response (total distance, number of capture tries)
   * fpr that given path
   * @returns
   */
  _createResponse = () => {
    // We have reached the end node, so we can reconstruct the shortest path
    console.log("Reached endNode, calculating the path + total distance");
    //   console.log(previous);
    let path = [];
    let totalDistance = 0;
    let node = this.endNode;
    let previousNode;
    let nCaptureTries = 0;
    let success = true;
    while (node) {
      path.unshift(node);
      previousNode = this.previous[node];
      // console.log(previousNode);
      if (node != this.startNode && this.graph[previousNode]) {
        totalDistance += this.graph[previousNode][node];
      }
      if (this.hunterPresences[node]) {
        nCaptureTries += 1;
        console.debug("Adding 1 capture try");
      }
      node = previousNode;
    }
    if (totalDistance == 0) {
      // Set the path to empty
      path = [];
      success = false;
    }
    return { success, path, distance: totalDistance, nCaptureTries };
  };
  /**
   * Calculates the distance to be added
   * @param distance
   * @param currentNode
   * @param bounty_hunters
   * @returns
   */
  _calculateNewDistance = (distance: number, currentNode: string) => {
    const hunterPresence: boolean = this.bounty_hunters.some(
      (hunter) => hunter.day == distance && hunter.planet == currentNode
    );
    let hunterPresenceDistance = 0;
    if (hunterPresence && !this.ignoreHunters) {
      console.debug(
        `There is a hunter in planet ${currentNode} the day ${distance}`
      );
      hunterPresenceDistance = Infinity;
    }
    const newDistance = Math.sqrt(distance ** 2 + hunterPresenceDistance);
    return { newDistance, hunterPresence };
  };
}
