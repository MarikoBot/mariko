const fs = require("fs");
const chalk = require("chalk");

const analysis = {
  deleted: [],
  skipped: [],
};

function read(path='') {
  const src = fs.readdirSync(`./src/${path}`);
  const lib = fs.readdirSync(`./lib/${path}`);

  for (let i = 0; i < src.length; i++) {
    if (i >= lib.length - 1) break;
    if (fs.statSync(`./src/${path}${src[i]}`).isDirectory()) {
      if (src[i] !== lib[i])
        fs.rmSync(`./lib/${path}${lib[i]}`);
      read(`${path}${src[i]}/`);
    }
    const lastDeleted = analysis.deleted.length;

    const [ts, js] = [src[i].replace(".ts", ""), lib[i].replace(".js", "")]

    if (ts !== js) {
      if (!src.includes(`${js}.ts`)) {
        fs.rmSync(`./lib/${path}${lib[i]}`);
        analysis.deleted.push(`lib/${path}${lib[i]}`);
      }
    }

    if (lastDeleted === analysis.deleted.length) analysis.skipped.push(`lib/${path}${lib[i]}`);
  }
}

if (!fs.existsSync("./lib/")) fs.mkdirSync("./lib/");
if (fs.existsSync("./src/")) read();

console.log(
  chalk.black.bgRedBright`PRE-COMPILATION CLEANING`,
  chalk.red`\nDeleted: ${analysis.deleted.length} elements\nSkipped: ${analysis.skipped.length} elements`
);