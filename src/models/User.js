import database from "../infra/database.js";

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

    const result = await database.query({ text, values });
    return await result.rows[0];
  }
}

async function create(userObject) {
  return await runCreateQuery(
    userObject.username,
    userObject.email,
    userObject.password
  );

  async function runCreateQuery(username, email, password) {
    const text = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
    const values = [username, email, password];
    const result = await database.query({ text, values });
    if (!result.rows[0]) {
      throw Error("User not found"); // TODO implement error handling
    }
    return await result.rows[0];
  }
}

const User = { getById, getByEmail, create };

export default User;
