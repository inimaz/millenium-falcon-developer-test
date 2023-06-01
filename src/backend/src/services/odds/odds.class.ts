import { Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import {
  CreateOddsInputData,
  CreateOddsResponse,
  IGraph,
  IMilleniumFalconConfig,
  ShortestPathResponse,
} from './interfaces';
import { shortestPathLogic } from './calculateShortestPath';

interface ServiceOptions {}

export class Odds {
  app: Application;
  options: ServiceOptions;
  routesService: any;
  graph: IGraph | undefined;
  milleniumFalconConfig: IMilleniumFalconConfig;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
    this.routesService = app.service('routes');
    this.milleniumFalconConfig = this.app.get('milleniumFalconConfig');
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
        'The autonomy of the ship is not enough to arrive to destiny.'
      );
      return { odds: 0 };
    }

    // We need to build a graph from the routes + the autonomy of the ship
    // then get the shortest path
    await this._calculateFullGraph();
    const shortestPathResponse = shortestPathLogic(
      this.graph as IGraph,
      this.milleniumFalconConfig.departure,
      this.milleniumFalconConfig.arrival,
      data.bounty_hunters,
      this.milleniumFalconConfig.autonomy,
      data.countdown
    );

    return this._buildResponse(shortestPathResponse);
  }
  /**
   * Get the odds
   * @param k number of times the bounty hunter has tried to capture you
   * @returns number in between 0 and 100 ==> 100 means it reaches destination. 0 it means it does not
   */
  _buildResponse(shortestPathResponse: ShortestPathResponse): { odds: number } {
    if (!shortestPathResponse.success) {
      return { odds: 0 };
    }
    // Get the number of times the Bounty Hunter tried to capture the Millennium Falcon
    const nCaptureTries = shortestPathResponse.nCaptureTries;

    let oddsOfBeingCaptured = 0;
    for (let i = 0; i < nCaptureTries; i++) {
      oddsOfBeingCaptured += 9 ** i / 10 ** (i + 1);
    }
    console.log('Final path: ', shortestPathResponse.path);
    console.log('Distance: ', shortestPathResponse.distance);
    console.log('nCaptureTries: ', shortestPathResponse.nCaptureTries);
    return { odds: 1 - oddsOfBeingCaptured };
  }

  async _calculateFullGraph() {
    if (this.graph) {
      console.log('Returning already-calculated graph');
      return;
    }
    const routes = await this.routesService.find({ paginate: false });
    const graph: IGraph = {};
    routes.forEach(
      (route: { ORIGIN: string; DESTINATION: string; TRAVEL_TIME: number }) => {
        // Set the origin node
        if (!graph[route.ORIGIN]) {
          graph[route.ORIGIN] = {};
        }
        graph[route.ORIGIN][route.DESTINATION] = route.TRAVEL_TIME;
        // Set the destination node
        if (!graph[route.DESTINATION]) {
          graph[route.DESTINATION] = {};
        }
        graph[route.DESTINATION][route.ORIGIN] = route.TRAVEL_TIME; // This is a guess, travel time might be the same back and forth
      }
    );
    console.log(`This is the graph: ${JSON.stringify(graph)}`);
    this.graph = graph;
  }
}
