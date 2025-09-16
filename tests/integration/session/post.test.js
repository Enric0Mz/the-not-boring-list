import supertest from "supertest";

import app from "#src/app.js";
import config from "#tests/config.js";

beforeAll(async () => {
  await config.clearDatabase();
});

describe("POST /session", () => {
  describe("Anonymous user", () => {
    it("With valid credentials", async () => {
      const password = "ValidPassword";
      const createdUser = await config.createUser({
        email: "valid@credentials.com",
        password,
      });
      const email = createdUser.email;

      res = await supertest(app)
        .post("/api/v1/session")
        .send({ email, password });

      const responseBody = res.body;

      expect(res.status).toBe(201);
      expect(responseBody).toEqual({
        token: responseBody.token,
        expires_at: responseBody.expires_at,
        updated_at: responseBody.updated_at,
      });

      expect(responseBody.expires_at > responseBody.updated_at).toBe(true);
    });

    it("With unexistent credentials", async () => {
      const payload = {
        email: "unexistent@email.com",
        password: "Unexistent@123",
      };
      const res = await supertest(app).post("/api/v1/session").send(payload);

      expect(res.status).toBe(404);
      const responseBody = await res.body;
      expect(responseBody.error).toEqual({
        name: "NotFoundError",
        message: `The value ${payload.email} was not found in database`,
        action: "Insert a valid value for the specified resource",
        status_code: 404,
      });
    });
  });
});
