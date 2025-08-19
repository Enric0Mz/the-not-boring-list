import { Router } from "express";
import sessionUseCase from "#src/services/session-use-case.js";

const sessionRouter = Router();

sessionRouter.post("/", createUser);
sessionRouter.delete("/", deleteSession);

async function createUser(req, res) {
  const payload = req.body;
  const createdSession = await sessionUseCase.createSession(payload);
  return await res.status(201).json(createdSession);
}

async function deleteSession(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  await sessionUseCase.deleteSession(token);
  return res.sendStatus(204);
}

export default sessionRouter;
