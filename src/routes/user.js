import { Router } from "express";
import userUseCase from "../services/user-use-case.js";

const userRouter = Router();

userRouter.get("/", getSelfUser);
userRouter.post("/", createUser);

async function getSelfUser(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const user = await userUseCase.getSelfUser(token);
  return await res.status(200).json(user);
}

async function createUser(req, res) {
  const payload = req.body;
  const createdUser = await userUseCase.createUser(payload);
  return await res.status(201).json(createdUser);
}

export default userRouter;
