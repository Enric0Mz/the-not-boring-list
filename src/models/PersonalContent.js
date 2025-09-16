import database from "#src/infra/database.js";
import { NotFoundError } from "#src/infra/errors.js";

async function get(id, userId) {
  return await runGetQuery(id, userId);

  async function runGetQuery(id, userId) {
    const text = `
      SELECT
        contents_users.id, hours_invested, image, name, personal_notes, personal_score, status
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
      throw new NotFoundError();
    }
    return result;
  }
}

async function fetch(userId, contentType) {
  return await runSelectQuery(userId, contentType);

  async function runSelectQuery(userId, contentType) {
    const text = `
      SELECT
        content_type, description, hours_invested, hours_to_beat, image,
        name, personal_notes, personal_score, publisher, score, status, contents_users.id 
      FROM 
        contents_users
      LEFT JOIN
        contents
          on contents_users.content_id = contents.id
      LEFT JOIN
        games
          on games.content_id = contents.id
      WHERE
        user_id = $1
      AND
        content_type = $2
      AND
        active = TRUE
    `;
    const values = [userId, contentType];

    const execute = await database.query({ text, values });
    return await execute.rows;
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

async function update(id, payload, userId) {
  const game = await get(id, userId);
  if (!game) {
    throw new NotFoundError();
  }
  return await runUpdateQuery(id, payload);

  async function runUpdateQuery(id, payload) {
    const text = `
      UPDATE contents_users
      SET
        personal_score = COALESCE($1, personal_score),
        personal_notes = COALESCE($2, personal_notes),
        hours_invested = COALESCE($3, hours_invested),
        status = COALESCE($4, status)
      WHERE
        id = $5
      RETURNING *
    `;
    const values = [
      payload.personal_score,
      payload.personal_notes,
      payload.hours_invested,
      payload.status,
      id,
    ];
    const execute = await database.query({ text, values });
    const result = execute.rows[0];
    return result;
  }
}

async function setInactive(id, userId) {
  await get(id, userId);

  await runUpdateQuery(id);

  async function runUpdateQuery(id) {
    const text = `
      UPDATE contents_users
      SET
        active = FALSE
      WHERE
        id = $1    
    `;
    const values = [id];
    await database.query({ text, values });
  }
}

const PersonalContent = { fetch, create, update, setInactive };

export default PersonalContent;
