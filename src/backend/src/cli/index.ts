import { GimmeTheOddsHandler } from "./gimmeTheOdds.handler";
import app from '../app'

const gimmeOddsHandler = new GimmeTheOddsHandler(app);
gimmeOddsHandler
  .calculate()
  .then((response) => {
    console.log(response);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
