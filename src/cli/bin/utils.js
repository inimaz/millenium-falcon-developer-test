const axios = require("axios");
var shell = require("shelljs");
const path = require("path");

const usageMessage =
  "\nUsage: give-me-the-odds <path/to/millennium-falcon.json> <path/to/empire.json>";
module.exports = { parseArguments, callAPI, showHelp, usageMessage };
function parseArguments(arguments) {
  console.log(arguments);
  return arguments;
}

function callAPI(milleniumFalcon, empireJson) {
  console.log("Start backend");
  // Get the global path of the backend directory
  const currentDir = process.cwd();
  const backendDir = path.join(__dirname, "../../backend");
  const milleniumFalconFile = path.resolve(milleniumFalcon);
  const empireConfigFile = path.resolve(empireJson);
  console.log(currentDir);
  console.log(backendDir);
  console.log(milleniumFalconFile);
  console.log(empireConfigFile);
  //
  shell.exec(`cd ${backendDir};
  npm install;
  npm run compile;
  LOG_LEVEL=DEBUG MILLENIUM_FALCON_CONFIG_FILE=${milleniumFalconFile} EMPIRE_CONFIG_FILE=${empireConfigFile} npm run cli;
  cd ${currentDir}`);
  shell.exit();
}

function showHelp() {
  console.log(usageMessage);
  console.log("\t--help\t\t      " + "Show help." + "\t\t\t" + "[boolean]\n");
}
