import database from "#src/infra/database.js";

async function get(baseGameId, contentType) {
  return await runGetQuery(baseGameId, contentType);

  async function runGetQuery(baseGameId, contentType) {
    const text = `
      SELECT 
        * 
      FROM 
        contents
      WHERE
        third_party_id = $1
      AND
        content_type = $2
    `;
    const values = [baseGameId, contentType];
    const execute = await database.query({ text, values });
    const result = await execute.rows; // TODO This is a list
    if (result.length == 0) {
      return null;
    }
    return result[0];
  }
}

async function fetch(baseGameId, contentType) {
  return await runSelectQuery(baseGameId, contentType);

  async function runSelectQuery(baseGameId, contentType) {
    const text = `
        SELECT 
          * 
        FROM 
          contents
        WHERE
          third_party_id = $1
        AND
          content_type = $2
      `;
    const values = [baseGameId, contentType];
    const execute = await database.query({ text, values });
    return await execute.rows;
  }
}

async function create(contentDetails, contentType) {
  const content = await runCreateContentQuery(contentDetails, contentType);
  const contentId = content.id;
  await runCreateGameQuery(contentDetails, contentId); // TODO create generic function to decide content type
  return contentId;

  async function runCreateContentQuery(contentDetails, contentType) {
    const text = `
      INSERT INTO
        contents
          (name, image, score, description, content_type, third_party_id)
      VALUES
          ($1, $2, $3, $4, $5, $6)
      RETURNING
        *
    `;
    const values = [
      contentDetails.name,
      contentDetails.background_image,
      contentDetails.metacritic,
      contentDetails.description_raw,
      contentType,
      contentDetails.id,
    ];
    const execute = await database.query({ text, values });
    return await execute.rows[0];
  }

  async function runCreateGameQuery(contentDetails, contentId) {
    const text = `
      INSERT INTO
        games
          (publisher, hours_to_beat, content_id)
      VALUES
          ($1, $2, $3)
      RETURNING
        *
    `;
    const values = [
      contentDetails.publishers[0].name,
      contentDetails.playtime,
      contentId,
    ];
    const execute = await database.query({ text, values });

    return await execute.rows[0];
  }
}

const Content = { get, fetch, create };

export default Content;
