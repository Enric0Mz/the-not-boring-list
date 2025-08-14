import database from "../infra/database.js";

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
    return await result.rows[0];
  }
}

const User = { create };

export default User;
