// routes-model.ts - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.
import { Knex } from 'knex';
import { Application } from '../declarations';
import knex from '../knex';

export default function (app: Application): Knex {
  const db: Knex = app.get('knexClient');
  const readDb: Knex = app.get('inputDataDbClient');
  const tableName = 'routes';
  db.schema
    .hasTable(tableName)
    .then(async (exists) => {
      if (exists) {
        await db.schema.dropTable(tableName);
      }
      await db.schema
        .createTable(tableName, (table) => {
          table.increments('id');
          table.string('ORIGIN').notNullable().checkNotIn(['']); // Name of the origin planet
          table.string('DESTINATION').notNullable().checkNotIn(['']); // Name of the destination planet
          table.integer('TRAVEL_TIME').checkPositive(); // Number days needed to travel from one planet to the other
        })
        .then(async () => {
          console.log(`Created ${tableName} table, Inserting the data now.`);
          const data = await readDb.select('*').from(tableName);
          // We add an id (feathers needs it for all the pagination features)
          let id = 1;
          data.forEach((item) => {
            item.id = id;
            id += 1;
          });
          console.log(data);
          await db(tableName).insert(data);
        })
        .catch((e) => console.error(`Error creating ${tableName} table`, e));
    })
    .catch((e) => console.error('Error: ', e));

  return db;
}
