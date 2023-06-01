import { Application } from "../declarations";
import * as fs from "fs";
import { IMilleniumFalconConfig } from "../services/odds/interfaces";
import path from "path";

export default function (app: Application) {
  let milleniumFalconConfig: IMilleniumFalconConfig;
  // const workingDir = process.cwd();
  if (process.env.MILLENIUM_FALCON_CONFIG_FILE) {
    const pathToFile = path.resolve(process.env.MILLENIUM_FALCON_CONFIG_FILE);
    const jsonString = fs.readFileSync(pathToFile, "utf-8");
    milleniumFalconConfig = JSON.parse(jsonString);
    milleniumFalconConfig.routes_db = path.resolve(
      milleniumFalconConfig.routes_db
    );
    console.log(milleniumFalconConfig.routes_db);
    console.log("Loading custom Millenium Falcon config");
  } else {
    console.log("Loading default Millenium Falcon config");
    milleniumFalconConfig = app.get("defaultMilleniumFalconConfig");
  }

  app.set("milleniumFalconConfig", milleniumFalconConfig);
}
