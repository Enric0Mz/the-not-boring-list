import e from "express";

const app = e();

app.use(e.json());
app.get("/health", async (req, res) => {
  res.json({ ok: true });
});

export default app;
