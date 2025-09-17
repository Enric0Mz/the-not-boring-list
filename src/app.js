import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "./services/swagger/swagger-output.json" with { type: "json" };

import e from "express";

import healthRouter from "./routes/health.js";
import userRouter from "./routes/user.js";
import sessionRouter from "./routes/session.js";
import gameRouter from "./routes/game.js";
import errorHandler from "./middlewares/error-handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicPath = path.join(__dirname, "..", "public");

dotenv.config({ path: ".env" });

const app = e();

app.use(e.json());

const options = { customCssUrl: "/public/css/swagger-ui.css" };

app.use("/public/css", e.static(publicPath));

app.use(
  "/docs",
  function (req, res, next) {
    swaggerFile.host = req.get("host");
    req.swaggerDoc = swaggerFile;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, options),
);

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/games", gameRouter);

app.use(errorHandler);

export default app;
