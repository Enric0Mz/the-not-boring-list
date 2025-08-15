import { Router } from "express";
import sessionUseCase from "../services/session-use-case.js";

const sessionRouter = Router();

sessionRouter.post("/", createUser);

async function createUser(req, res) {
  const payload = req.body;
  const createdSession = await sessionUseCase.createSession(payload);
  return await res.status(201).json(createdSession);
}

export default sessionRouter;
