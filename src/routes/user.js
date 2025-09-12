import { Router } from "express";
import userUseCase from "#src/services/user-use-case.js";
import validateSession from "#src/middlewares/session-handler.js";

const userRouter = Router();

userRouter.get("/", validateSession, getSelfUser);
userRouter.post("/", createUser);

async function getSelfUser(req, res) {
  /* 
    #swagger.tags = ["Users"]
    #swagger.summary = "Get self user"
    #swagger.description = "Gets authenticated self user and return basic information"
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.responses[200] = {
      description:  "Get self user",
      schema: {$ref: "#/components/schemas/getUserResponse"}
    }
  */
  return await res.status(200).json(req.session);
}

async function createUser(req, res) {
  /* 
    #swagger.tags = ["Users"]
    #swagger.summary = "Create user"
    #swagger.description = "Create user with fields username, email and password"
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/createUserBody"  
          }
        }
      }
    }
  */

  const payload = req.body;
  const createdUser = await userUseCase.createUser(payload);
  return await res.status(201).json(createdUser);
}

export default userRouter;
