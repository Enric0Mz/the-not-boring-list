import e from "express";
import router from "./routes/user.js";

const app = e();

app.use(e.json());
app.get("/health", async (req, res) => {
  res.json({ ok: true });
});

app.use("/api/v1/user", router);

export default app;
