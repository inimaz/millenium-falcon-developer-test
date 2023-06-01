// Priority queue implementation
export default class PriorityQueue {
  queue: any[];
  constructor() {
    this.queue = [];
  }

  enqueue(
    planetName: string,
    priority: number,
    deltaDistance: number,
    currentFuel: number,
    nCaptureTries: number
  ) {
    const queueItem = {
      planetName,
      priority,
      deltaDistance,
      currentFuel,
      nCaptureTries,
    };
    this.queue.push(queueItem);
    this.sort();
    console.debug(
      `Adding to queue item ${JSON.stringify(queueItem)} . QUEUE After:`,
      this.queue
    );
  }

  dequeue() {
    console.debug("Queue before dequeuing:", this.queue);
    const item = this.queue.shift();
    return {
      planetName: item.planetName,
      priority: item.priority,
      currentFuel: item.currentFuel,
      nCaptureTries: item.nCaptureTries,
    };
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  sort() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }
}
