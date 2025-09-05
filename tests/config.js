import database from "#src/infra/database.js";
import { faker } from "@faker-js/faker";
import userUseCase from "#src/services/user-use-case.js";
import sessionUseCase from "#src/services/session-use-case.js";

async function clearDatabase() {
  const text = `
    DO
      $do$
    BEGIN
      EXECUTE
        (SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
          FROM   pg_class
          WHERE  relkind = 'r'
          AND    relnamespace = 'public'::regnamespace
          AND    relname <> 'pgmigrations'
        );
    END
      $do$;
  `; // Query provided by https://stackoverflow.com/users/939860/erwin-brandstetter
  return await database.query(text);
}

async function createUser(userObject) {
  return await userUseCase.createUser({
    username:
      userObject.username || faker.internet.username().replace(/[_.-]g/, ""),
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "validPassword",
  });
}

async function sessionCreate(createdUser) {
  return await sessionUseCase.createSession(createdUser);
}

async function getSession() {
  const password = "validPassword";
  const createdUser = await createUser({
    password,
  });
  const createdSession = await sessionCreate(
    Object.assign(createdUser, { password }),
  );
  return createdSession;
}

const config = {
  clearDatabase,
  createUser,
  sessionCreate,
  getSession,
};

export default config;
