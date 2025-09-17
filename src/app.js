import dotenv from "dotenv";
import e from "express";
import swaggerUi from "swagger-ui-express";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import cors from "cors";

import swaggerFile from "./services/swagger/swagger-output.json" with { type: "json" };

import healthRouter from "./routes/health.js";
import userRouter from "./routes/user.js";
import sessionRouter from "./routes/session.js";
import gameRouter from "./routes/game.js";
import errorHandler from "./middlewares/error-handler.js";

dotenv.config({ path: ".env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = e();

app.use(cors());

app.use(e.json());

const publicPath = path.join(__dirname, "..", "public");
app.use("/public", e.static(publicPath));

const options = {
  customCssUrl: "/public/css/swagger-ui.css",
};

app.use(
  "/docs",
  function (req, res, next) {
    swaggerFile.host = req.get("host");
    req.swaggerDoc = swaggerFile;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(null, options),
);

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/games", gameRouter);

app.use(errorHandler);

export default app;
