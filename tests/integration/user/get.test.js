import supertest from "supertest";
import app from "../../../src/app";
import config from "../../config";

beforeAll(async () => {
  await config.clearDatabase();
});

describe("GET /user", () => {
  describe("Default user", () => {
    it("With invalid token", async () => {
      res = await supertest(app)
        .get("/api/v1/user")
        .set("Authorization", "Token SomeInvalidToken");

      expect(res.status).toBe(401);
      expect(res.body.error).toEqual({
        name: "UnauthorizedError",
        message: "Invalid or expired authorization token",
        action: "Provide a valid authorization token",
        status_code: 401,
      });
    });

    it("With valid authentication", async () => {
      const password = "validPassword";
      const createdUser = await config.createUser({
        username: "AuthenticatedUser",
        password,
      });
      const createdSession = await config.createSession(
        Object.assign(createdUser, { password })
      );

      res = await supertest(app)
        .get("/api/v1/user")
        .set("Authorization", `Token ${createdSession.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        username: createdUser.username,
        email: createdUser.email,
      });
    });
  });
});
