import e from "express";
import userRouter from "./routes/user.js";
import sessionRouter from "./routes/session.js";

const app = e();

app.use(e.json());
app.get("/health", async (req, res) => {
  res.json({ ok: true });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/session", sessionRouter);

export default app;
