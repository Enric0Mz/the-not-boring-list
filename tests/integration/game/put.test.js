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
        message:
          "Fields [unexistendField] does not exist or cannot be modified for especified resource",
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

      expect(responseBody.status).toBe("concluded");
    });
    it("Updating game with all possible fields", async () => {
      const session = await config.getSession();
      const createPayload = {
        name: "Programação em jogo",
        personal_score: 94,
        personal_notes: "Excelente jogo para praticar programação",
        hours_invested: 4,
        status: "in_progress",
      };

      const createdGame = await supertest(app)
        .post("/api/v1/games")
        .set("Authorization", `Token ${session.token}`)
        .send(createPayload);

      expect(createdGame.status).toBe(201);

      const uploadPayload = {
        personal_score: 85,
        personal_notes:
          "Excelente jogo para praticar programação, porém ficou bem repetitivo no final",
        hours_invested: 8,
        status: "concluded",
      };

      const res = await supertest(app)
        .put(`/api/v1/games/${createdGame.body.id}`)
        .set("Authorization", `Token ${session.token}`)
        .send(uploadPayload);

      expect(res.status).toBe(201);

      responseBody = res.body;

      expect(responseBody.personal_score).toBe(uploadPayload.personal_score);
      expect(responseBody.personal_notes).toBe(uploadPayload.personal_notes);
      expect(responseBody.hours_invested).toBe(uploadPayload.hours_invested);
      expect(responseBody.status).toBe(uploadPayload.status);
    });
  });
});
