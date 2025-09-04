import dotenv from "dotenv";

import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./services/swagger/swagger-output.json" with {type: "json"}

import e from "express";

import userRouter from "./routes/user.js";
import sessionRouter from "./routes/session.js";
import gameRouter from "./routes/game.js";
import errorHandler from "./middlewares/error-handler.js";

dotenv.config({ path: ".env" });

const app = e();

app.use(e.json());

app.use(bodyParser.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/health", async (req, res) => {
  return res.json({ ok: true });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/games", gameRouter);

app.use(errorHandler);

export default app;
