import { Router } from "express";
import userUseCase from "../services/user-use-case.js";

const userRouter = Router();

userRouter.post("/", createUser);

async function createUser(req, res) {
  const payload = req.body;
  const createdUser = await userUseCase.createUser(payload);
  return await res.status(201).json(createdUser);
}

export default userRouter;
