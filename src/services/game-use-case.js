import rawg from "./apis/rawg.js";
import Content from "#src/models/Content.js";
import PersonalContent from "#src/models/PersonalContent.js";
import { bucketName } from "#src/infra/aws/bucket.js";
import { putBucketObject, getBucketObject } from "#src/infra/aws/bucket.js";
import genRandomBytes from "./utils/random-bytes.js";
import validateUuid from "./utils/validate-uuid.js";
import { UnprocessableEntityError } from "#src/infra/errors.js";

async function getPersonalGames(userId) {
  const contentType = "game";
  const result = await PersonalContent.fetch(userId, contentType);
  await includeImagesUrls(result);
  return result;

  async function includeImagesUrls(games) {
    for (const game of games) {
      if (game.image && !game.image.startsWith("https")) {
        const imageUrl = await getBucketObject(game.image);
        game.image = imageUrl;
      }
    }
  }
}

async function search(searchParams) {
  const games = await rawg.searchGames(searchParams);
  const result = extractPayload(games);
  return { data: result };

  function extractPayload(games) {
    let result = [];
    games.results.forEach((element) => {
      result.push({
        id: element.id,
        name: element.name,
        image: element.background_image,
        hours_to_beat: element.playtime,
        score: element.metacritic,
      });
    });
    return result;
  }
}

async function create(baseGameId, payload, userId, file) {
  const contentType = "game";
  if (baseGameId) {
    return await withExternalGameDetails(
      baseGameId,
      payload,
      userId,
      contentType,
    );
  }
  return await withoutExternalGameDetails(payload, userId, contentType, file);

  async function withExternalGameDetails(
    baseGameId,
    payload,
    userId,
    contentType,
  ) {
    const gameInDataBase = await searchGameInDataBase(baseGameId, contentType);
    if (!gameInDataBase) {
      const gameDetails = await rawg.searchGameDetails(baseGameId);
      const newGameId = await Content.create(gameDetails, contentType);

      return await PersonalContent.create(newGameId, payload, userId);
    }
    return await PersonalContent.create(gameInDataBase.id, payload, userId);
  }

  async function searchGameInDataBase(baseGameId, contentType) {
    return await Content.get(baseGameId, contentType);
  }

  async function withoutExternalGameDetails(
    payload,
    userId,
    contentType,
    file,
  ) {
    let createdFile;
    if (file) {
      createdFile = await sendImagePayload(file);
    }
    const baseContent = await Content.create(payload, contentType, createdFile);
    return await PersonalContent.create(baseContent, payload, userId);
  }

  async function sendImagePayload(file) {
    const imageName = file.originalname + genRandomBytes(32);
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await putBucketObject(params);
    return imageName;
  }
}

async function update(gameId, payload, userId) {
  const isUuid = validateUuid(gameId);
  if (!isUuid) {
    throw new UnprocessableEntityError("Incorrect data type for field gameId");
  }
  validatePayload(payload);
  const result = await PersonalContent.update(gameId, payload, userId);
  return extractResultFields(result);

  function validatePayload(payload) {
    const allowedFields = [
      "personal_notes",
      "personal_score",
      "hours_invested",
      "status",
    ];
    const invalidKeys = Object.keys(payload).filter(
      (key) => !allowedFields.includes(key),
    );
    if (invalidKeys.length > 0) {
      throw new UnprocessableEntityError(
        `Fields [${payload.unexistendField}] does not exist for especified resource`,
      );
    }
  }

  function extractResultFields(result) {
    return {
      personal_scores: result.personal_scores,
      personal_notes: result.personal_notes,
      hours_invested: result.hours_invested,
      status: result.status,
    };
  }
}

const gameUseCase = { getPersonalGames, search, create, update };

export default gameUseCase;
