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
gameRouter.put("/{:gameId}", updateGame);

async function getPersonalGames(req, res) {
  /* 
    #swagger.tags = ["Games"]
    #swagger.summary = "Fetch created games"
    #swagger.description = "Get games that were previous created"
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.responses[200] = {
      description:  "Get game list",
      schema: {$ref: "#/components/schemas/fetchPersonalGamesResponse"}
    }
  */

  const userId = req.session.userId;
  const games = await gameUseCase.getPersonalGames(userId);
  return await res.status(200).json({ data: games });
}

async function searchGame(req, res) {
  /* 
    #swagger.tags = ["Games"]
    #swagger.summary = "Search games"
    #swagger.description = "Search games, powered by RAWG API"
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.responses[200] = {
      description:  "Get searched games",
      schema: {$ref: "#/components/schemas/searchGamesResponse"}
    }
  */

  const searchParam = req.query.name;
  const games = await gameUseCase.search(searchParam);
  return await res.status(200).json(games);
}

async function createGame(req, res) {
  /* 
    #swagger.tags = ["Games"]
    #swagger.summary = "Create games"
    #swagger.description = "Create your game"
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            allOf: [
              {$ref: "#/components/schemas/createGameBody"},
              {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "binary"
                  }
                }
              }  
            ],
          required: ["name"],
          }
        }
      }
    }
    #swagger.responses[200] = {
      description:  "Sucessful session created",
      schema: {$ref: "#/components/schemas/searchGamesResponse"}
    }
    */
  const baseGameId = req.path.slice(1); // TODO find better approach
  const payload = req.body;
  const userId = req.session.userId;
  const file = req.file;
  const result = await gameUseCase.create(baseGameId, payload, userId, file);
  return await res.status(201).json(result);
}

async function updateGame(req, res) {
  const gameId = req.path.slice(1);
  const userId = req.session.userId;
  payload = req.body;
  const result = await gameUseCase.update(gameId, payload, userId);
  return await res.status(201).json(result);
}

export default gameRouter;
