import rawg from "./apis/rawg.js";

async function search(searchParams) {
  const games = await rawg.searchGame(searchParams);
  let result = [];
  games.results.forEach((element) => {
    result.push({
      name: element.name,
      image: element.background_image,
      hours_to_beat: element.playtime,
      score: element.metacritic,
    });
  });
  return { data: result };
}

const gameUseCase = { search };

export default gameUseCase;
