import { Router } from "express";
import gameUseCase from "#src/services/game-use-case.js";
import validateSession from "#src/middlewares/session-handler.js";

const gameRouter = Router();

gameRouter.use(validateSession);
gameRouter.get("/", searchGame);
gameRouter.post("/:baseGameId", createGame);

async function searchGame(req, res) {
  const searchParam = req.query.name;
  const games = await gameUseCase.search(searchParam);
  return await res.status(200).json(games);
}

async function createGame(req, res) {
  const baseGameId = req.path;
  const payload = req.body;
  const userId = req.session.userId;
  const result = await gameUseCase.create(baseGameId, payload, userId);
  return await res.status(201).json(result);
}

export default gameRouter;
