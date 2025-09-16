import { Router } from "express";
import sessionUseCase from "#src/services/session-use-case.js";
import validateSession from "#src/middlewares/session-handler.js";

const sessionRouter = Router();

sessionRouter.post("/", createSession);
sessionRouter.delete("/", validateSession, deleteSession);

async function createSession(req, res) {
  /* 
    #swagger.tags = ["Session"]
    #swagger.summary = "Create session"
    #swagger.description = "Authenticate in the application and get api Token"
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/createSessionBody"  
          }
        }
      }
    }
    #swagger.responses[200] = {
      description:  "Sucessful session created",
      schema: {$ref: "#/components/schemas/sessionResponse"}
    }
    */

  const payload = req.body;
  const createdSession = await sessionUseCase.createSession(payload);
  return await res.status(201).json(createdSession);
}

async function deleteSession(req, res) {
  /* 
    #swagger.tags = ["Session"]
    #swagger.summary = "Delete session"
    #swagger.description = "Delete current session"
    #swagger.security = [{"apiKeyAuth": []}]
  */
  const token = req.session.session.token;

  await sessionUseCase.deleteSession(token);
  return res.sendStatus(204);
}

export default sessionRouter;
