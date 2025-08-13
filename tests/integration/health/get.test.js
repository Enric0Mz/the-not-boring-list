import app from "../../../src/app";
import supertest from "supertest";

describe("GET /health", () => {
  describe("Anonymous User", () => {
    it("Should return true", async () => {
      const res = await supertest(app).get("/health");

      expect(res.status).toBe(200);

      expect(res.body.ok).toBe(true);
    });
  });
});
