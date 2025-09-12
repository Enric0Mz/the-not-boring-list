import supertest from "supertest";

import app from "#src/app.js";
import config from "#tests/config.js";
import { theWitcher3 } from "#tests/mocks/games.js";

beforeAll(async () => {
  await config.clearDatabase();
});

describe("PUT /games", () => {
  describe("Default user", () => {
    it("Updating game with invalid id type", async () => {
      const session = await config.getSession();

      const gameId = 123;

      const res = await supertest(app)
        .put(`/api/v1/games/${gameId}`)
        .set("Authorization", `Token ${session.token}`);

      expect(res.status).toBe(422);

      const responseBody = await res.body;
      expect(responseBody.error).toEqual({
        name: "UnprocessableEntityError",
        message: `Incorrect data type for field gameId`,
        action: "Provide a valid value for the specified resource",
        status_code: 422,
      });
    });
    it("Updating game with unexistent id", async () => {
      const session = await config.getSession();

      const gameId = "2654bbc9-7a23-4515-93ab-a684c2b5aa7d";

      const res = await supertest(app)
        .put(`/api/v1/games/${gameId}`)
        .set("Authorization", `Token ${session.token}`)
        .send({ personal_score: 10 });

      expect(res.status).toBe(404);

      const responseBody = await res.body;
      expect(responseBody.error).toEqual({
        name: "NotFoundError",
        message: `Resource not found`,
        action: "Insert a valid value for the specified resource",
        status_code: 404,
      });
    });
    it("Upating game with unexistent field", async () => {
      const session = await config.getSession();

      const baseGameId = theWitcher3.id; // The Witcher 3: Wild Hunt

      const createdGame = await supertest(app)
        .post(`/api/v1/games/${baseGameId}`)
        .set("Authorization", `Token ${session.token}`)
        .send({
          personal_score: 95,
          personal_notes: "Um jogo muito imersivo e com ótima ambientação",
          hours_invested: 40,
          status: "concluded",
        });

      const payload = { unexistendField: "Unexistent" };

      const res = await supertest(app)
        .put(`/api/v1/games/${createdGame.body.id}`)
        .set("Authorization", `Token ${session.token}`)
        .send(payload);

      expect(res.status).toBe(422);
      const responsebody = res.body;

      expect(responsebody.error).toEqual({
        name: "UnprocessableEntityError",
        message: `Fields [${payload.unexistendField}] does not exist for especified resource`,
        action: "Provide a valid value for the specified resource",
        status_code: 422,
      });
    });
    it("Upating game with valid status field", async () => {
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

      const payload = { status: "concluded" };

      const res = await supertest(app)
        .put(`/api/v1/games/${createdGame.body.id}`)
        .set("Authorization", `Token ${session.token}`)
        .send(payload);

      expect(res.status).toBe(201);
      const responseBody = res.body;
      console.log(responseBody);

      expect(responseBody.status).toBe("concluded");
    });
  });
});
