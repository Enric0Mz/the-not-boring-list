import e from "express";
import database from "./infra/database.js";

const app = e();
const port = 3000;

app.get("/", async (req, res) => {
  const result = await database.query("SELECT 1 + 1");
  res.send(result.rows[0]);
});

app.listen(port, () => {
  console.log(`EXAMPLE OF LISTENING IN PORT ${port}`);
});
