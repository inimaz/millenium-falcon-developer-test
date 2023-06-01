import { IGraph } from "../../src/services/odds/interfaces";
import { ShortestPath } from "../../src/services/odds/calculateShortestPath/shortestPath";
const hothBountyHunters = [
  { day: 7, planet: "Hoth" },
  { day: 6, planet: "Hoth" },
  { day: 5, planet: "Hoth" },
  { day: 4, planet: "Hoth" },
  { day: 3, planet: "Hoth" },
  { day: 2, planet: "Hoth" },
  { day: 1, planet: "Hoth" },
];
describe("shortestPath", () => {
  test.each([
    [
      "Tatooine",
      "Endor",
      {
        success: true,
        distance: 7,
        path: ["Tatooine", "Hoth", "Endor"],
        nCaptureTries: 0,
      },
    ],
    [
      "Tatooine",
      "Dagobah",
      {
        success: true,
        distance: 6,
        path: ["Tatooine", "Dagobah"],
        nCaptureTries: 0,
      },
    ],
    [
      "Dagobah",
      "Hoth",
      {
        success: true,
        distance: 1,
        path: ["Dagobah", "Hoth"],
        nCaptureTries: 0,
      },
    ],
    [
      "Endor",
      "Tatooine",
      {
        success: true,
        distance: 7,
        path: ["Endor", "Hoth", "Tatooine"],
        nCaptureTries: 0,
      },
    ],
    ["Endor", "Endor", { success: true, nCaptureTries: 0 }],
  ])(
    "should succeed -- From: %s to: %s",
    (startNode, endNode, expectedResponse) => {
      const graph: IGraph = {
        Tatooine: { Dagobah: 6, Hoth: 6 },
        Endor: { Dagobah: 4, Hoth: 1 },
        Dagobah: { Endor: 4, Hoth: 1, Tatooine: 6 },
        Hoth: { Dagobah: 1, Endor: 1, Tatooine: 6 },
      };
      const shortestPath = new ShortestPath(graph, startNode, endNode);
      const response = shortestPath.calculatePath();
      expect(response).toEqual(expectedResponse);
    }
  );
  test.each([
    [
      "A",
      "E",
      {
        success: true,
        distance: 6,
        path: ["A", "B", "C", "E"],
        nCaptureTries: 0,
      },
    ],
    [
      "B",
      "D",
      { success: true, distance: 2, path: ["B", "A", "D"], nCaptureTries: 0 },
    ],
    ["A", "F", { success: false, distance: 0, path: [], nCaptureTries: 0 }],
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
      const shortestPath = new ShortestPath(graph, startNode, endNode);
      const response = shortestPath.calculatePath();
      expect(response).toEqual(expectedResponse);
    }
  );
  test.each([
    [
      "Tatooine",
      "Endor",
      {
        success: true,
        distance: 10,
        path: ["Tatooine", "Dagobah", "Endor"],
        nCaptureTries: 0,
      },
    ],
    [
      "Tatooine",
      "Dagobah",
      {
        success: true,
        distance: 6,
        path: ["Tatooine", "Dagobah"],
        nCaptureTries: 0,
      },
    ],
    [
      "Dagobah",
      "Hoth",
      {
        success: true,
        distance: 1,
        path: ["Dagobah", "Hoth"],
        nCaptureTries: 0,
      },
    ],
    [
      "Endor",
      "Tatooine",
      {
        success: true,
        distance: 10,
        path: ["Endor", "Dagobah", "Tatooine"],
        nCaptureTries: 0,
      },
    ],
    ["Endor", "Endor", { success: true, nCaptureTries: 0 }],
  ])(
    "should succeed -- From: %s to: %s with bounty hunters in Hoth",
    (startNode, endNode, expectedResponse) => {
      const graph: IGraph = {
        Tatooine: { Dagobah: 6, Hoth: 6 },
        Endor: { Dagobah: 4, Hoth: 1 },
        Dagobah: { Endor: 4, Hoth: 1, Tatooine: 6 },
        Hoth: { Dagobah: 1, Endor: 1, Tatooine: 6 },
      };
      const shortestPath = new ShortestPath(
        graph,
        startNode,
        endNode,
        hothBountyHunters,
        Infinity,
        Infinity,
        0
      );
      const response = shortestPath.calculatePath();
      expect(response).toEqual(expectedResponse);
    }
  );
  test.each([
    [
      "Tatooine",
      "Endor",
      {
        success: true,
        distance: 7,
        path: ["Tatooine", "Hoth", "Endor"],
        nCaptureTries: 1,
      },
    ],
  ])(
    "should succeed -- From: %s to: %s with bounty hunters and max distance (ignore hunters true)",
    (startNode, endNode, expectedResponse) => {
      const graph: IGraph = {
        Tatooine: { Dagobah: 6, Hoth: 6 },
        Endor: { Dagobah: 4, Hoth: 1 },
        Dagobah: { Endor: 4, Hoth: 1, Tatooine: 6 },
        Hoth: { Dagobah: 1, Endor: 1, Tatooine: 6 },
      };
      const shortestPath = new ShortestPath(
        graph,
        startNode,
        endNode,
        hothBountyHunters,
        Infinity,
        Infinity,
        Infinity
      );
      const response = shortestPath.calculatePath();
      expect(response).toEqual(expectedResponse);
    }
  );
  test.each([
    [
      7,
      {
        success: false,
        distance: 0,
        path: [],
        nCaptureTries: 0,
      },
    ],
    [
      8,
      {
        success: true,
        distance: 8,
        path: ["Tatooine", "Hoth", "Endor"],
        nCaptureTries: 2,
      },
    ],
    [
      9,
      {
        success: true,
        distance: 9,
        path: [],
        nCaptureTries: 1,
      },
    ],
    [
      10,
      {
        success: true,
        distance: 10,
        path: [],
        nCaptureTries: 0,
      },
    ],
  ])(
    "should succeed -- Examples from docs",
    (maxDistance, expectedResponse) => {
      const startNode = "Tatooine";
      const endNode = "Endor";
      const autonomy = 6;
      const bounty_hunters = [
        {
          planet: "Hoth",
          day: 6,
        },
        {
          planet: "Hoth",
          day: 7,
        },
        {
          planet: "Hoth",
          day: 8,
        },
      ];
      const graph: IGraph = {
        Tatooine: { Dagobah: 6, Hoth: 6 },
        Endor: { Dagobah: 4, Hoth: 1 },
        Dagobah: { Endor: 4, Hoth: 1, Tatooine: 6 },
        Hoth: { Dagobah: 1, Endor: 1, Tatooine: 6 },
      };
      const shortestPath = new ShortestPath(
        graph,
        startNode,
        endNode,
        bounty_hunters,
        autonomy,
        maxDistance,
        Infinity
      );
      const response = shortestPath.calculatePath();
      expect(response).toEqual(expectedResponse);
    }
  );
  test.each([
    [
      "Tatooine",
      "Endor",
      Infinity,
      7,
      Infinity,
      {
        success: true,
        distance: 7,
        path: ["Tatooine", "Hoth", "Endor"],
        nCaptureTries: 1,
      },
    ],
    [
      "Tatooine",
      "Endor",
      Infinity,
      6,
      Infinity,
      {
        success: true,
        distance: 8,
        path: ["Tatooine", "Hoth", "Endor"],
        nCaptureTries: 2,
      },
    ],
    [
      "Tatooine",
      "Endor",
      5,
      7,
      Infinity,
      {
        success: false,
        distance: 0,
        path: [],
        nCaptureTries: 0,
      },
    ],
  ])(
    "should succeed or fail -- From: %s to: %s with bounty hunters and max distance %s and ship autonomy %s (maxHunters %s) ",
    (
      startNode,
      endNode,
      maxDistance,
      autonomy,
      maxHunters,
      expectedResponse
    ) => {
      const graph: IGraph = {
        Tatooine: { Dagobah: 6, Hoth: 6 },
        Endor: { Dagobah: 4, Hoth: 1 },
        Dagobah: { Endor: 4, Hoth: 1, Tatooine: 6 },
        Hoth: { Dagobah: 1, Endor: 1, Tatooine: 6 },
      };
      const shortestPath = new ShortestPath(
        graph,
        startNode,
        endNode,
        hothBountyHunters,
        autonomy,
        maxDistance,
        maxHunters
      );
      const response = shortestPath.calculatePath();
      expect(response).toEqual(expectedResponse);
    }
  );
});
