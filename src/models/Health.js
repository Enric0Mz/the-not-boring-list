import database from "#src/infra/database.js";

async function getActiveConns() {
  return await runSelectQuery();

  async function runSelectQuery() {
    const text = `
      SELECT 
        count(*)::int 
      FROM 
        pg_stat_activity 
      WHERE 
        datname = $1;
    `;
    const values = [process.env.POSTGRES_DB];

    const execute = await database.query({ text, values });
    return await execute.rows[0].count;
  }
}

const Health = {
  getActiveConns,
};

export default Health;
