
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const usersRouter = require("./routes/api/user");
const swaggerDocument = require("./swagger.json");

const authRouter = require('./routes/api/auth');
const waterRouter  = require('./routes/api/water');

require("dotenv").config();
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/auth",  authRouter);
app.use("/user", usersRouter);
app.use("/api/water", waterRouter); 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;

  res.status(status).json({ message });
});

module.exports = app;