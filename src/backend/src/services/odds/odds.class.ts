import { Params } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { CreateOddsInputData, CreateOddsResponse, IGraph } from "./interfaces";

interface ServiceOptions {}

export class Odds {
  app: Application;
  options: ServiceOptions;
  routesService: any;
  graph: IGraph | undefined;
  milleniumFalconConfig: any;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
    this.routesService = app.service("routes");
    this.milleniumFalconConfig = this.app.get("milleniumFalcon");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(
    data: CreateOddsInputData,
    params?: Params
  ): Promise<CreateOddsResponse> {
    // TODO: add validation of data
    // Get the values from the input json
    const countdown = data.countdown;
    const bounty_hunters = data.bounty_hunters;
    // Millenium falcon
    if (countdown < this.milleniumFalconConfig.autonomy) {
      console.log(
        "The autonomy of the ship is not enough to arrive to destiny."
      );
      return { odds: 0 };
    }

    // We need to build a graph from the routes + the autonomy of the ship
    // then get the shortest path

    this.graph = await this._calculateFullGraph();

    // Get the number of times the Bounty Hunter tried to capture the Millennium Falcon
    const nCaptureTries = 0;

    const odds = this._getOdds(nCaptureTries);

    return { odds };
  }
  /**
   * Get the odds
   * @param k number of times the bounty hunter has tried to capture you
   * @returns
   */
  _getOdds(k: number) {
    let odds = 0;
    for (let i = 0; i < k; i++) {
      odds += 9 ** k / 10 ** (k + 1);
    }
    return odds;
  }

  async _calculateFullGraph(): Promise<IGraph> {
    const routes = await this.routesService.find();
    const graph: IGraph = {};
    routes.forEach(
      (route: { ORIGIN: string; DESTINATION: string; TRAVEL_TIME: number }) => {
        graph[route.ORIGIN][route.DESTINATION] = route.TRAVEL_TIME;
        graph[route.DESTINATION][route.ORIGIN] = route.TRAVEL_TIME; // This is a guess, travel time might be the same back and forth
      }
    );
    console.log(`This is the graph: ${JSON.stringify(graph)}`);
    return graph;
  }
}
