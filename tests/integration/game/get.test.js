import supertest from "supertest";

import app from "#src/app.js";
import config from "#tests/config.js";

beforeAll(async () => {
  await config.clearDatabase();
});

describe("GET /games", () => {
  describe("Default user", () => {
    it("Searching valid game in RAWG Api", async () => {
      const password = "validPassword";
      const createdUser = await config.createUser({
        password,
      });
      const createdSession = await config.createSession(
        Object.assign(createdUser, { password })
      );

      const searchParam = "The Witcher 3";

      res = await supertest(app)
        .get("/api/v1/games")
        .set("Authorization", `Token ${createdSession.token}`)
        .query({ name: searchParam });

      expect(res.status).toBe(200);
      console.log(res.body.data);

      expect(res.body.data.length).toBe(20); // limited by pagination;
      expect(res.body.data[0]).toEqual({
        id: 3328,
        name: "The Witcher 3: Wild Hunt",
        image:
          "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
        hours_to_beat: 43,
        score: 92,
      });
    }, 10000);
    it("Trying to search without valid session", async () => {
      const searchParam = "The Witcher 3";

      res = await supertest(app)
        .get("/api/v1/games")
        .set("Authorization", "Token someInvalidToken")
        .query({ name: searchParam });

      expect(res.status).toBe(401);

      expect(res.body.error).toEqual({
        name: "UnauthorizedError",
        message: "Invalid or expired authorization token",
        action: "Provide a valid authorization token",
        status_code: 401,
      });
    });
  });
});
