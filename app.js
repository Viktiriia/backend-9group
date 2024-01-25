const express = require('express');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(cors());

module.exports = app;