// Initializes the `odds` service on path `/odds`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Odds } from './odds.class';
import hooks from './odds.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'odds': Odds & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/odds', new Odds(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('odds');

  service.hooks(hooks);
}
