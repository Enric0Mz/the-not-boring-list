import { ServiceUnavailableError } from "#src/infra/errors.js";

const RAWG_BASE_API_URL = process.env.RAWG_BASE_API_URL;
const RAWG_API_TOKEN = process.env.RAWG_API_TOKEN;
async function searchGames(searchParam) {
  const queryParams = new URLSearchParams({
    key: RAWG_API_TOKEN,
    search: searchParam,
  });

  const url = `${RAWG_BASE_API_URL}/games`;
  const response = await fetch(`${url}?${queryParams.toString()}`);
  if (response.status != 200) {
    console.info(await response.text());
    throw new ServiceUnavailableError("An error ocurr fetching Rawg Api");
  }
  return await response.json();
}

async function searchGameDetails(gameId) {
  const queryParams = new URLSearchParams({
    key: RAWG_API_TOKEN,
  });
  const url = `${RAWG_BASE_API_URL}/games${gameId}`;
  const response = await fetch(`${url}?${queryParams.toString()}`);
  if (response.status != 200) {
    console.info(await response.text());
    throw new ServiceUnavailableError("An error ocurr fetching Rawg Api");
  }
  return await response.json();
}

const rawg = {
  searchGames,
  searchGameDetails,
};

export default rawg;
