import supertest from "supertest";
import app from "../../../src/app";
import config from "../../config";

beforeAll(async () => {
  await config.clearDatabase();
});

describe("POST /user", () => {
  describe("Anonymous user", () => {
    it("With valid user", async () => {
      const username = "ValidUser";
      const email = "valid@email.com";
      const password = "validPassword";

      res = await supertest(app)
        .post("/api/v1/user")
        .send({ username, email, password });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        username,
        email,
      });
    });
  });
});
