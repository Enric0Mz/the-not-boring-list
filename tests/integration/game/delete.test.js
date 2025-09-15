import app from "#src/app.js";
import config from "#tests/config.js";
import supertest from "supertest";
import { theWitcher3 } from "#tests/mocks/games.js";

beforeAll(async () => {
  await config.clearDatabase();
});

describe("DELETE /games", () => {
  describe("Default User", () => {
    it("Deleting game that do not exist", async () => {
      const session = await config.getSession();
      const unexistentGameId = "f2ba920e-f085-46e5-8432-9c7a76841141";

      const res = await supertest(app)
        .delete(`/api/v1/games/${unexistentGameId}`)
        .set("Authorization", `Token ${session.token}`);

      expect(res.status).toBe(404);

      const responseBody = res.body;

      expect(responseBody.error).toEqual({
        name: "NotFoundError",
        message: `Resource not found`,
        action: "Insert a valid value for the specified resource",
        status_code: 404,
      });
    });
    it("Deleting game that exist", async () => {
      const session = await config.getSession();

      const baseGameId = theWitcher3.id; // The Witcher 3: Wild Hunt

      const createdGame = await supertest(app)
        .post(`/api/v1/games/${baseGameId}`)
        .set("Authorization", `Token ${session.token}`)
        .send({
          personal_score: 95,
          personal_notes: "Um jogo muito imersivo e com ótima ambientação",
          hours_invested: 40,
          status: "in_progress",
        });

      const gameId = createdGame.body.id;

      const res = await supertest(app)
        .delete(`/api/v1/games/${gameId}`)
        .set("Authorization", `Token ${session.token}`);

      expect(res.status).toBe(204); // No content
    });

    it("Ensure that deleted game does not appear in user list", async () => {
      const session = await config.getSession();

      const payload = {
        name: "Game Indie desconhecido",
        personal_score: 50,
        personal_notes: "Não recomendo, jogo mediando",
        hours_invested: 8,
        status: "dropped",
      };
      const createdGame = await supertest(app)
        .post(`/api/v1/games/`)
        .set("Authorization", `Token ${session.token}`)
        .send(payload);

      const createdGameId = createdGame.body.id;

      expect(createdGame.status).toBe(201);

      // Delete created game
      const res = await supertest(app)
        .delete(`/api/v1/games/${createdGameId}`)
        .set("Authorization", `Token ${session.token}`);

      expect(res.status).toBe(204);

      // Check if game was soft deleted
      const userList = await supertest(app)
        .get(`/api/v1/games/personal`)
        .set("Authorization", `Token ${session.token}`);

      expect(userList.status).toBe(200);

      const userListBody = userList.body;

      expect(Array.isArray(userListBody.data)).toBe(true);
      expect(userListBody.data).toEqual([]);
    });
  });
});
