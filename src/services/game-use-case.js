import rawg from "./apis/rawg.js";

async function search(searchParams) {
  const games = await rawg.searchGame(searchParams);
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

const gameUseCase = { search };

export default gameUseCase;
