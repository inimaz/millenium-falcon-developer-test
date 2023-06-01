import knex from 'knex';
import { Application } from './declarations';

export default function (app: Application): void {
  const { client, connection } = app.get('sqlite');
  const db = knex({ client, connection });
  app.set('knexClient', db);

  // Now we have another connection just to read the iniital data
  const inputDataConnection = {
    filename: app.get('milleniumFalconConfig').routes_db,
  };
  const inputDataDbClient = knex({ client, connection: inputDataConnection });
  app.set('inputDataDbClient', inputDataDbClient);
}
