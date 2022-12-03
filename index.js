const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");

require("dotenv").config();

module.exports = new (class App {
  constructor() {
    this.server = express();

    this.middlewares();

    this.routes();
  }
  middlewares() {
    this.server.use(cors());

    this.server.use(express.json({ limit: "10mb" }));

    this.server.use(express.text({ limit: "10mb" }));

    this.server.use(express.urlencoded({ limit: "10mb", extended: true }));
  }
  routes() {
    this.server.use(routes);
  }
})();
