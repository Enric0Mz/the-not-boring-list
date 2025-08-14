import database from "../src/infra/database";
import { faker } from "@faker-js/faker";
import User from "../src/models/User";

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
  return await User.create({
    username:
      userObject.username || faker.internet.username().replace(/[_.-]g/, ""),
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "validpassword",
  });
}

const config = {
  clearDatabase,
  createUser,
};

export default config;
