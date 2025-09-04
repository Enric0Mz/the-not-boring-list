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
      someBody: {
        $name: "Jhon Doe",
        $age: 29,
        about: "Description",
      },
      someResponse: {
        $name: "Jhon Doe",
        $age: 29,
        about: "Description",
      },
      contentType: {
        "@enum": ["game", "books", "tv-show", "movie"],
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
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
