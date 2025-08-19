import supertest from "supertest";
import app from "../../../src/app";
import config from "../../config";
import sessionUseCase from "../../../src/services/session-use-case";
import { jest } from "@jest/globals";

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

    it("With expired token", async () => {
      jest.useFakeTimers({
        now: Date.now() - sessionUseCase.TOKEN_EXPIRATION_IN_MILLISECONDS,
      });
      const password = "expiredToken";
      const createdUser = await config.createUser({
        password,
      });
      const createdSession = await config.createSession(
        Object.assign(createdUser, { password })
      );

      jest.useRealTimers();

      res = await supertest(app)
        .get("/api/v1/user")
        .set("Authorization", `Token ${createdSession.token}`);

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

      const waitToRequest = 1 * 60 * 60 * 1000; // 1 hour

      jest.useFakeTimers({ now: Date.now() + waitToRequest });

      res = await supertest(app)
        .get("/api/v1/user")
        .set("Authorization", `Token ${createdSession.token}`);

      expect(res.status).toBe(200);

      const responseBody = res.body;

      expect(responseBody).toEqual({
        username: createdUser.username,
        email: createdUser.email,
        session: {
          token: createdSession.token,
          expires_at: responseBody.session.expires_at,
        },
      });
      expect(
        new Date(responseBody.session.expires_at).getTime() >
          new Date(createdSession.expires_at).getTime()
      ).toBe(true);
    });
    jest.useRealTimers();

    it("With token about to be expired", async () => {
      const extraTime = 1000; // 1 second
      jest.useFakeTimers({
        now:
          Date.now() -
          sessionUseCase.TOKEN_EXPIRATION_IN_MILLISECONDS +
          +extraTime,
      });
      const password = "validPassword";
      const createdUser = await config.createUser({
        password,
      });
      const createdSession = await config.createSession(
        Object.assign(createdUser, { password })
      );
      jest.useRealTimers();

      res = await supertest(app)
        .get("/api/v1/user")
        .set("Authorization", `Token ${createdSession.token}`);

      expect(res.status).toBe(200);

      const responseBody = res.body;

      expect(responseBody).toEqual({
        username: createdUser.username,
        email: createdUser.email,
        session: {
          token: createdSession.token,
          expires_at: responseBody.session.expires_at,
        },
      });

      expect(
        new Date(responseBody.session.expires_at).getTime() >
          new Date(createdSession.expires_at).getTime()
      ).toBe(true);
    });
  });
});
