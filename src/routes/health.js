import { Router } from "express";
import Health from "#src/models/Health.js";

const healthRouter = Router();

healthRouter.get("/", async (req, res) => {
  const result = await Health.getActiveConns();
  return res.json({ ok: true, opened_cons: result });
});

export default healthRouter;
