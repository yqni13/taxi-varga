const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

class ExpressLoader {
    static init() {
        const app = express();

        app.use(bodyParser.json());
        app.use(cors());
        app.options("*", cors());

        return app;
    }
}

module.exports = { ExpressLoader };