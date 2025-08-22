import supertest from "supertest";

import app from "#src/app.js";
import config from "#tests/config.js";
import { theWitcher3 } from "#tests/mocks/games.js";

beforeAll(async () => {
  await config.clearDatabase();
});

describe("POST /games", () => {
  describe("Default user", () => {
    it("Creating game with rawg base information", async () => {
      const session = await config.getSession();
      const baseGameId = theWitcher3.id; // The Witcher 3: Wild Hunt

      res = await supertest(app)
        .post(`/api/v1/games/${baseGameId}`)
        .set("Authorization", `Token ${session.token}`)
        .send({
          personal_score: 95,
          personal_notes: "Um jogo muito imersivo e com ótima ambientação",
          hours_invested: 40,
          status: "concluded",
        });

      expect(res.status).toBe(201);

      expect(res.body).toEqual({
        name: theWitcher3.name,
        image: theWitcher3.background_image,
        score: theWitcher3.metacritic,
        personal_score: 95,
        personal_notes: "Um jogo muito imersivo e com ótima ambientação",
        hours_invested: 40,
        status: "concluded",
      });
    });
  });
});
