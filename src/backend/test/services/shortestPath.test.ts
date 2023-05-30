import { IGraph } from "../../src/services/odds/interfaces";
import { dijkstra } from "../../src/services/odds/shortestPath";
describe("shortestPath", () => {
  test.each([
    ["Tatooine", "Endor", { distance: 7, path: ["Tatooine", "Hoth", "Endor"] }],
    ["Tatooine", "Dagobah", { distance: 6, path: ["Tatooine", "Dagobah"] }],
    ["Dagobah", "Hoth", { distance: 1, path: ["Dagobah", "Hoth"] }],
    ["Endor", "Tatooine", { distance: 7, path: ["Endor", "Hoth", "Tatooine"] }],
    ["Endor", "Endor", { distance: 0, path: [] }],
  ])(
    "should succeed -- From: %s to: %s",
    (startNode, endNode, expectedResponse) => {
      const graph: IGraph = {
        Tatooine: { Dagobah: 6, Hoth: 6 },
        Endor: { Dagobah: 4, Hoth: 1 },
        Dagobah: { Endor: 4, Hoth: 1, Tatooine: 6 },
        Hoth: { Dagobah: 1, Endor: 1, Tatooine: 6 },
      };
      const response = dijkstra(graph, startNode, endNode);
      expect(response).toEqual(expectedResponse);
    }
  );
  test.each([
    ["A", "E", { distance: 6, path: ["A", "B", "C", "E"] }],
    ["B", "D", { distance: 2, path: ["B", "A", "D"] }],
    ["A", "F", { distance: 0, path: [] }],
  ])(
    "should succeed -- From: %s to: %s",
    (startNode, endNode, expectedResponse) => {
      const graph: IGraph = {
        A: { B: 1, C: 6, D: 1 },
        B: { A: 1, C: 4, E: 12 },
        C: { A: 6, B: 4, D: 6, E: 1 },
        D: { C: 6, D: 1 },
        E: { B: 12, C: 1 },
        F: {},
      };
      const response = dijkstra(graph, startNode, endNode);
      expect(response).toEqual(expectedResponse);
    }
  );
});
