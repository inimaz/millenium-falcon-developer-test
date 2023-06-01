import { GimmeTheOddsHandler } from "./gimmeTheOdds.handler";
import app from "../app";

(async function check() {
  const gimmeOddsHandler = new GimmeTheOddsHandler(app);
  await gimmeOddsHandler
    .calculate()
    .then((response) => {
      console.log(response);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
})();
