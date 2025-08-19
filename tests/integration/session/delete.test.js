import app from "../../../src/app";
import supertest from "supertest";
import config from "../../config";

beforeAll(async () => {
  await config.clearDatabase();
});

describe("DELETE /session", () => {
  describe("Default user", () => {
    it("with valid session", async () => {
      const password = "validPassword";
      const createdUser = await config.createUser({
        password,
      });
      const createdSession = await config.createSession(
        Object.assign(createdUser, { password })
      );
      const res = await supertest(app)
        .delete("/api/v1/session")
        .set("Authorization", `Token ${createdSession.token}`);

      expect(res.status).toBe(204);

      // Trying to use deleted session
      const resToConfirmDeletion = await supertest(app)
        .get("/api/v1/user")
        .set("Authorization", `Token ${createdSession.token}`);

      expect(resToConfirmDeletion.status).toBe(401);

      expect(resToConfirmDeletion.body.error).toEqual({
        name: "UnauthorizedError",
        message: "Invalid or expired authorization token",
        action: "Provide a valid authorization token",
        status_code: 401,
      });
    });
  });
});
