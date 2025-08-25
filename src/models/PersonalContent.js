import database from "#src/infra/database.js";
import { NotFoundError } from "#src/infra/errors.js";

async function get(id, userId) {
  return await runGetQuery(id, userId);

  async function runGetQuery(id, userId) {
    const text = `
      SELECT
        hours_invested, image, name, personal_notes, personal_score, status
      FROM
        contents
      LEFT JOIN
        contents_users
      ON 
        contents_users.content_id = contents.id
      WHERE
        contents_users.id = $1
      AND
        contents_users.user_id = $2
    `;
    const values = [id, userId];

    const execute = await database.query({ text, values });
    const result = await execute.rows[0];

    if (!result) {
      throw NotFoundError();
    }
    return result;
  }
}

async function create(contentId, payload, userId) {
  const result = await runCreateQuery(contentId, payload, userId);
  return await get(result.id, userId);

  async function runCreateQuery(contentId, payload, userId) {
    const text = `
      INSERT INTO
        contents_users
          (personal_score, personal_notes, hours_invested, status, content_id, user_id)
      VALUES
          ($1, $2, $3, $4, $5, $6)
      RETURNING
        *
    `;
    const values = [
      payload.personal_score,
      payload.personal_notes,
      payload.hours_invested,
      payload.status,
      contentId,
      userId,
    ];
    const execute = await database.query({ text, values });
    return await execute.rows[0];
  }
}

const PersonalContent = { create };

export default PersonalContent;
