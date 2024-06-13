const { JsonDatabase } = require("wio.db");

const conf = new JsonDatabase({
  databasePath: "./src/config.json",
});

class Config {
  constructor() {}

  addData(name, data) {
    return conf.add(name, data);
  }

  getData(name) {
    return conf.get(name);
  }

  setData(name, value) {
    return conf.set(name, value);
  }
}

const config = new Config();

module.exports = config;
