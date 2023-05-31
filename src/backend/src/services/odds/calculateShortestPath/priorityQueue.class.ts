// Priority queue implementation
export default class PriorityQueue {
  queue: any[];
  constructor() {
    this.queue = [];
  }

  enqueue(planetName: string, priority: number) {
    const queueItem = { planetName, priority };
    this.queue.push(queueItem);
    this.sort();
    console.debug(
      `Addint to queue item ${JSON.stringify(queueItem)} . QUEUE After:`,
      this.queue
    );
  }

  dequeue() {
    console.debug('DEQUEING. QUEUE BEFORE:', this.queue);
    return this.queue.shift().planetName;
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  sort() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }
}
