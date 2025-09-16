import supertest from "supertest";

import app from "#src/app.js";
import config from "#tests/config.js";

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

    it("With duplicate user", async () => {
      const payload = {
        email: "valid@email.com", // Same as previous email
        username: "SomeUsername",
        password: "somePassword",
      };

      res = await supertest(app).post("/api/v1/user").send(payload);

      expect(res.status).toBe(409);

      const responseBody = res.body;
      expect(responseBody.error).toEqual({
        name: "ConflictError",
        message: `The value ${payload.email} already exists for specified field`,
        action: "Provide a new value for the specified resource",
        status_code: 409,
      });
    });
  });
});
