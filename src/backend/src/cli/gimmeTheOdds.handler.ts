import { Application } from "../declarations";
import * as fs from "fs";
import path from "path";

export class GimmeTheOddsHandler {
  app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  async calculate() {
    if (!process.env.EMPIRE_CONFIG_FILE) {
      throw Error("Empire.json not defined");
    }
    const pathToFile = path.resolve(process.env.EMPIRE_CONFIG_FILE);
    const jsonString = fs.readFileSync(pathToFile, "utf-8");
    const data = JSON.parse(jsonString);
    return this.app.service("odds").create(data);
  }
}
