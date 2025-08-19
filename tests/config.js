import database from "#src/infra/database";
import { faker } from "@faker-js/faker";
import userUseCase from "#src/services/user-use-case";
import sessionUseCase from "#src/services/session-use-case";

async function clearDatabase() {
  return await database.query(` 
    DO
      $do$
    BEGIN
      EXECUTE
        (SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
          FROM   pg_class
          WHERE  relkind = 'r'
          AND    relnamespace = 'public'::regnamespace
        );
    END
      $do$;
    `); // Query provided by https://stackoverflow.com/users/939860/erwin-brandstetter
}

async function createUser(userObject) {
  return await userUseCase.createUser({
    username:
      userObject.username || faker.internet.username().replace(/[_.-]g/, ""),
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "validPassword",
  });
}

async function createSession(createdUser) {
  return await sessionUseCase.createSession(createdUser);
}

const config = {
  clearDatabase,
  createUser,
  createSession,
};

export default config;
