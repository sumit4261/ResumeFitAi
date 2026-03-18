const app = require("../src/app");
const ConnectToDB = require("../src/config/database");

let isDbConnected = false;

module.exports = async (req, res) => {
  if (!isDbConnected) {
    await ConnectToDB();
    isDbConnected = true;
  }

  return app(req, res);
};
