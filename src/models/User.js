import database from "#src/infra/database.js";
import { ConflictError } from "#src/infra/errors.js";

async function getById(id) {
  return await runSelectQuery(id);

  async function runSelectQuery(id) {
    const text = `
      SELECT
        email, username
      FROM
        users
      WHERE
        id = $1
    `;
    const values = [id];

    const execute = await database.query({ text, values });
    const result = await execute.rows[0];

    if (!result) {
      throw Error("UserNotFound");
    }
    return result;
  }
}

async function getByEmail(email) {
  return await runSelectQuery(email);

  async function runSelectQuery(email) {
    const text = `
      SELECT
        id, password
      FROM 
        users
      WHERE
        email = $1
    `;
    const values = [email];

    const exeute = await database.query({ text, values });
    const result = await exeute.rows[0];
    return await result;
  }
}

async function create(userObject) {
  const user = await getByEmail(userObject.email);
  if (user) {
    throw new ConflictError(userObject.email);
  }

  return await runCreateQuery(
    userObject.username,
    userObject.email,
    userObject.password,
  );

  async function runCreateQuery(username, email, password) {
    const text = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
    const values = [username, email, password];
    const result = await database.query({ text, values });
    return await result.rows[0];
  }
}

const User = { getById, getByEmail, create };

export default User;
