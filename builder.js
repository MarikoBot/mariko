const fs = require("fs");

const folders = fs.readdirSync("./lib");

fs.rm("./lib", { recursive: true, force: true }, (err) => {
  if (err) throw err;
  console.log("Deleted ./lib");
  fs.mkdirSync("./lib");
});