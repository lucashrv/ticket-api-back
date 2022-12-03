const express = require("express");
const ticketController = require('../controller/ticketController')

module.exports = new (class IndexRoutes {
    constructor () {
        this.routes = express.Router();

        this.ticketController = new ticketController();
        this.setup();
    }

    setup() {
        this.routes.post("/api/ticket", this.ticketController.store);
        this.routes.get("/api/all-patient", this.ticketController.listAll);
        this.routes.get("/api/ticket", this.ticketController.index);
        this.routes.delete("/api/ticket", this.ticketController.call);
    }
})().routes
