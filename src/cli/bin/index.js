#! /usr/bin/env node
const yargs = require("yargs");
const utils = require("./utils.js");
const options = yargs
  .usage(utils.usageMessage)
  .option("l", {
    alias: "languages",
    describe: "List all supported languages.",
    type: "boolean",
    demandOption: false,
  })
  .help(true).argv;

// Parse all the arguments
if (yargs.argv._[0] == null) {
  utils.showHelp();
  return;
}
const arguments = utils.parseArguments(yargs.argv._);
if (arguments.length != 2) {
  utils.showHelp();
  return;
}

utils.callAPI(arguments[0], arguments[1]);
