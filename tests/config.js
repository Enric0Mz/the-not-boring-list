import database from "../src/infra/database";
import { faker } from "@faker-js/faker";
import User from "../src/models/User";
import password from "../src/infra/security/password";

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
  const hashedPassword = await password.hash(
    userObject.password || "validPassword"
  );
  return await User.create({
    username:
      userObject.username || faker.internet.username().replace(/[_.-]g/, ""),
    email: userObject.email || faker.internet.email(),
    password: hashedPassword,
  });
}

const config = {
  clearDatabase,
  createUser,
};

export default config;
