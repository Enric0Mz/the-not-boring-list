import database from "../src/infra/database";

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

const config = {
  clearDatabase,
};

export default config;
