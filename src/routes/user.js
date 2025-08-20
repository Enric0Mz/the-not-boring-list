import { Router } from "express";
import userUseCase from "#src/services/user-use-case.js";
import validateSession from "#src/middlewares/session-handler.js";

const userRouter = Router();

userRouter.get("/", validateSession, getSelfUser);
userRouter.post("/", createUser);

async function getSelfUser(req, res) {
  return await res.status(200).json(req.session);
}

async function createUser(req, res) {
  const payload = req.body;
  const createdUser = await userUseCase.createUser(payload);
  return await res.status(201).json(createdUser);
}

export default userRouter;
