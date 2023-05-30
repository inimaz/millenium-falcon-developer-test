import { IGraph } from "./interfaces";
export function dijkstra(
  graph: IGraph,
  startNode: string,
  endNode: string
): { path: string[]; distance: number } {
  // Create an object to store the shortest distance to each node
  const distances: any = {};
  // Create an object to store the previous node in the shortest path
  const previous: any = {};
  // Create a priority queue to store nodes with their distances
  const queue = new PriorityQueue();

  // Initialize the distances and previous nodes
  for (const node in graph) {
    if (node === startNode) {
      distances[node] = 0;
      queue.enqueue(node, 0);
    } else {
      distances[node] = Infinity;
      queue.enqueue(node, Infinity);
    }
    previous[node] = null;
  }
  //   console.log(queue);

  // Traverse the graph
  while (!queue.isEmpty()) {
    const currentNode = queue.dequeue();
    // console.log("CurrentNode:", currentNode);

    if (currentNode === endNode) {
      // We have reached the end node, so we can reconstruct the shortest path
      console.log("Reached endNode, calculating the path + total distance");
      //   console.log(previous);
      let path = [];
      let totalDistance = 0;
      let node = endNode;
      let previousNode;
      while (node) {
        path.unshift(node);
        previousNode = previous[node];
        // console.log(previousNode);
        if (node != startNode && graph[previousNode]) {
          totalDistance += graph[previousNode][node];
        }
        node = previousNode;
      }
      if (totalDistance == 0) {
        // Set the path to empty
        path = [];
      }
      return { path, distance: totalDistance };
    }

    if (currentNode || distances[currentNode] !== Infinity) {
      for (const neighbor in graph[currentNode]) {
        const distance = distances[currentNode] + graph[currentNode][neighbor];

        if (distance < distances[neighbor]) {
          // Found a shorter path to the neighbor
          distances[neighbor] = distance;
          previous[neighbor] = currentNode;
          queue.enqueue(neighbor, distance);
        }
      }
    }
  }

  // If we reach this point, there is no path from startNode to endNode
  return { path: [], distance: Infinity };
}

// Priority queue implementation
class PriorityQueue {
  queue: any[];
  constructor() {
    this.queue = [];
  }

  enqueue(item: any, priority: number) {
    this.queue.push({ item, priority });
    this.sort();
  }

  dequeue() {
    return this.queue.shift().item;
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  sort() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }
}
