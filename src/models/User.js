import database from "../infra/database.js";

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

const User = { create, getByEmail };

export default User;
