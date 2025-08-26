import { Router } from "express";
import multer from "multer";

import gameUseCase from "#src/services/game-use-case.js";
import validateSession from "#src/middlewares/session-handler.js";

const gameRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

gameRouter.use(validateSession);
gameRouter.get("/personal", getPersonalGames);
gameRouter.get("/", searchGame);
gameRouter.post("/{:baseGameId}", upload.single("image"), createGame);

async function getPersonalGames(req, res) {
  const userId = req.session.userId;
  const games = await gameUseCase.getPersonalGames(userId);
  return await res.status(200).json({ data: games });
}

async function searchGame(req, res) {
  const searchParam = req.query.name;
  const games = await gameUseCase.search(searchParam);
  return await res.status(200).json(games);
}

async function createGame(req, res) {
  const baseGameId = req.path.slice(1); // TODO find better approach
  const payload = req.body;
  const userId = req.session.userId;
  const file = req.file;
  const result = await gameUseCase.create(baseGameId, payload, userId, file);
  return await res.status(201).json(result);
}

export default gameRouter;
