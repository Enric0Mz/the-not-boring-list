import { Router } from "express";
import gameUseCase from "#src/services/game-use-case.js";
import validateSession from "#src/middlewares/session-handler.js";

const gameRouter = Router();

gameRouter.use(validateSession);
gameRouter.get("/", searchGame);

async function searchGame(req, res) {
  const searchParam = req.query.name;
  const games = await gameUseCase.search(searchParam);
  return await res.status(200).json(games);
}

export default gameRouter;
