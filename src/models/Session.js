import database from "../infra/database.js";

async function create(token, expiresAt, userId) {
  return await runCreateQuery(token, expiresAt, userId);

  async function runCreateQuery(token, expiresAt, userId) {
    const text = `
      INSERT INTO
        sessions (token, expires_at, user_id)
      VALUES
        ($1, $2, $3)
      RETURNING
        token, expires_at, updated_at
    `;
    const values = [token, expiresAt, userId];

    const result = await database.query({ text, values });

    return await result.rows[0];
  }
}

const Session = { create };

export default Session;
