import supertest from "supertest";

import app from "#src/app.js";
import config from "#tests/config.js";
import Content from "#src/models/Content.js";
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
        personal_score: 95,
        personal_notes: "Um jogo muito imersivo e com ótima ambientação",
        hours_invested: 40,
        status: "concluded",
      });
    });

    it("Creating game that already exists in database", async () => {
      const session = await config.getSession();
      const session2 = await config.getSession();

      const baseGameId = theWitcher3.id; // The Witcher 3: Wild Hunt
      contentType = "game";

      // Create game with another valid session
      await supertest(app)
        .post(`/api/v1/games/${baseGameId}`)
        .set("Authorization", `Token ${session2.token}`)
        .send({
          personal_score: 95,
          personal_notes: "Um jogo muito imersivo e com ótima ambientação",
          hours_invested: 40,
          status: "concluded",
        });

      res = await supertest(app)
        .post(`/api/v1/games/${baseGameId}`)
        .set("Authorization", `Token ${session.token}`)
        .send({
          personal_score: 65,
          personal_notes: "Um jogo bom, porém um pouco repetitivo",
          hours_invested: 12,
          status: "dropped",
        });

      expect(res.status).toBe(201);

      expect(res.body).toEqual({
        name: theWitcher3.name,
        image: theWitcher3.background_image,
        personal_score: 65,
        personal_notes: "Um jogo bom, porém um pouco repetitivo",
        hours_invested: 12,
        status: "dropped",
      });

      // Ensure that both games share same data in DB
      const contents = await Content.fetch(baseGameId, contentType);
      expect(contents.length).toBe(1);
    });

    it("Creating game with only raw data", async () => {
      const session = await config.getSession();
      const payload = {
        name: "Jogo indie desconhecido",
        personal_score: 99,
        personal_notes: "Ninguém da atenção, mas deveriam",
        hours_invested: 9,
        status: "in_progress",
        image: null,
      };

      res = await supertest(app)
        .post("/api/v1/games")
        .set("Authorization", `Token ${session.token}`)
        .send(payload);

      expect(res.status).toBe(201);

      expect(res.body).toEqual(payload);
    });

    it("Creating game with image", async () => {
      const session = await config.getSession();
      const payload = {
        name: "Jogo com upload de imagem",
        personal_score: 88,
        personal_notes: "As imagens do jogo são sensacionais",
        hours_invested: 12,
        status: "concluded",
      };

      // Create a fake buffer to simulate an image file 📸
      const fakeImageBuffer = Buffer.from("fake image data");

      const res = await supertest(app)
        .post("/api/v1/games")
        .set("Authorization", `Token ${session.token}`)
        .field("name", payload.name)
        .field("personal_score", payload.personal_score)
        .field("personal_notes", payload.personal_notes)
        .field("hours_invested", payload.hours_invested)
        .field("status", payload.status)
        .attach("image", fakeImageBuffer, "test-cover.png");

      expect(res.status).toBe(201);

      expect(res.body).toEqual(expect.objectContaining(payload));

      expect(res.body).toHaveProperty("image");
      expect(res.body.image).not.toBeNull();
    });
  });
});
