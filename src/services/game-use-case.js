import rawg from "./apis/rawg.js";
import Content from "#src/models/Content.js";
import PersonalContent from "#src/models/PersonalContent.js";

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

async function create(baseGameId, payload, userId) {
  contentType = "game";
  if (baseGameId) {
    const gameInDatabaseId = await Content.get(baseGameId, contentType);
    if (gameInDatabaseId) {
      const result = await PersonalContent.create(gameInDatabaseId, payload);
    }
    const gameDetails = await rawg.searchGameDetails(baseGameId);
    const newGameId = await Content.create(gameDetails, contentType);

    return await PersonalContent.create(newGameId, payload, userId);
  }
}

const gameUseCase = { search, create };

export default gameUseCase;
