const fs = require("fs");
const chalk = require("chalk");

if (fs.existsSync("./lib/")) fs.rmdirSync("./lib/", { recursive: true });

console.log(chalk.black.bgRedBright`PRE-COMPILATION CLEANED`);