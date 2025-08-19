import database from "#src/infra/database.js";
import { NotFoundError, UnauthorizedError } from "#src/infra/errors.js";

async function getByToken(token) {
  return await runSelectQuery(token);

  async function runSelectQuery(token) {
    const text = `
      SELECT 
        user_id
      FROM 
        sessions
      WHERE
        token = $1
      AND
        expires_at > NOW();
    `;
    const values = [token];
    const execute = await database.query({ text, values });
    const result = await execute.rows[0];
    if (!result) {
      throw new UnauthorizedError();
    }
    return await result;
  }
}

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

async function refreshExpirationTime(token, expiresAt) {
  return await runUpdateQuery(token, expiresAt);

  async function runUpdateQuery(token, expiresAt) {
    const text = `
      UPDATE
        sessions
      SET
        expires_at = $2
      WHERE
        token = $1
      RETURNING
        *
    `;
    const values = [token, expiresAt];
    const execute = await database.query({ text, values });
    return await execute.rows[0];
  }
}

async function deleteSession(token) {
  return await runUpdateQuery(token);

  async function runUpdateQuery(token) {
    const text = `
      UPDATE
        sessions
      SET
        expires_at = created_at - INTERVAL '1 year'
      WHERE
        token = $1
      RETURNING
        *
        `;
    const values = [token];
    const execute = await database.query({ text, values });
    const result = await execute.rows[0];

    if (!result) {
      throw new NotFoundError("Session not found");
    }
  }
}

const Session = { getByToken, create, refreshExpirationTime, deleteSession };

export default Session;
