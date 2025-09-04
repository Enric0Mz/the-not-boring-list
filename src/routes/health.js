import { Router } from "express";
import Health from "#src/models/Health.js";

const healthRouter = Router();

healthRouter.get("/", async (req, res) => {
  /* 
    #swagger.tags = ["Health"]
    #swagger.summary = "Check application status"
    #swagger.description = "Get status of server and opened connections of db"
    #swagger.responses[200] = {
      description:  "Sucessful response",
      schema: {$ref: "#/components/schemas/HealthCheckResponse"}
    }
  */
  const result = await Health.getActiveConns();
  return res.json({ ok: true, opened_cons: result });
});

export default healthRouter;
