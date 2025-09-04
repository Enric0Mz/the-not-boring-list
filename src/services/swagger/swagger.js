import swaggerAutogenFunc from "swagger-autogen";

const swaggerAutogen = swaggerAutogenFunc({ openapi: "3.0.0" });
const outputFile = "./swagger-output.json";
const endpointsFile = ["../../app.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "the-not-boring-list",
    description: "Documentation the not boring API",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  components: {
    schemas: {
      //Bodys
      createSessionBody: {
        email: "email@example.com",
        password: "validPassword@123",
      },
      createUserBody: {
        email: "email@example.com",
        password: "validPassword@123",
        username: "exampleUser",
      },
      createGameBody: {
        name: "game Example",
        personal_score: 96,
        personal_notes: "A really fun game to play many hours",
        hours_invested: 43,
        status: "concluded",
      },

      // Responses 2xx
      sessionResponse: {
        token: "string",
        expires_at: "string",
        created_at: "string",
      },
      getUserResponse: {
        userId: "string",
        name: "string",
        email: "string",
        username: "string",
        session: {
          expires_at: "datetime",
          token: "string",
        },
      },
      fetchPersonalGamesResponse: {
        name: "string",
        personal_score: 0,
        personal_notes: "string",
        hours_invested: 0,
        status: "string",
        image: "string",
        content_type: "string",
        description: "string",
        hours_to_beat: 0,
        publisher: "string",
        score: 0,
      },
      searchGamesResponse: {
        id: 0,
        name: "string",
        image: "string",
        hours_to_beat: 0,
        score: 0,
      },

      // Enums
      contentType: {
        "@enum": ["game", "books", "tv-show", "movie"],
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
      apiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        describe: "API Token",
      },
    },
  },
};

(async () => {
  try {
    await swaggerAutogen(outputFile, endpointsFile, doc);
    console.log("Swagger documentation generated successfully.");
    await import("../../../server.js");
  } catch (error) {
    console.error("Failed to generate docs or start server:", error);
  }
})();
