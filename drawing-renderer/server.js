const express = require("express");
const lzString = require("lz-string");
const { Pool: PGPool } = require("pg");
const Sentry = require('@sentry/node');

Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.ENVIRONMENT });

const APP_PORT = 80;
const DATABASE_URL = process.env.DATABASE_URL;
const dbUrlRegexp = /^postgres:\/\/([^:@]+):?([^@]+)?@([^:\/]+):?(\d{2,5})?\/([a-zA-Z0-9_-]+)$/;
const dbParams = DATABASE_URL.match(dbUrlRegexp);

const pool = new PGPool({
  user: dbParams[1],
  password: dbParams[2] || process.env.DB_PASSWORD,
  host: dbParams[3],
  port: dbParams[4],
  database: dbParams[5],
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const app = express();

app.use(Sentry.Handlers.requestHandler());

app.get("/health", (req, res) => {
  res.send("I'm up!");
});

async function sendPng(res, next, table, column, id) {
  const dbClient = await pool.connect();
  try {
    const dbResponse = await dbClient.query(
      `SELECT ${column} FROM ${table} WHERE uuid = $1`,
      [id]
    );
    if (!dbResponse.rows.length) {
      res.status(404).send("Not found!");
    }
    const encodedDrawing = dbResponse.rows[0][column];
    const decodedDrawing = lzString.decompressFromBase64(encodedDrawing);

    const base64Data = decodedDrawing.replace("data:image/png;base64,", "");
    const buffer = Buffer.from(base64Data, "base64");
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-disposition":
        "attachment;filename=" + id + ".png",
      "Content-Length": buffer.length,
      "Cache-Control": "max-age=31556926",
    });
    res.end(buffer);
  } catch (err) {
    next(err);
  } finally {
    await dbClient.release();
  }
}

app.get("/drawings/:padStepId.png", async function (req, res, next) {
  sendPng(res, next, "core_padstep", "drawing", req.params.padStepId)
});

app.get("/drawings/avatar/:playerId/:firstCharacters.png", async function (req, res, next) {
  sendPng(res, next, "core_player", "avatar", req.params.playerId)
});

app.use(Sentry.Handlers.errorHandler());

app.listen(APP_PORT, () => {
  console.log(`Drawing renderer listening at http://localhost:${APP_PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received");

  app.close(() => {
    console.log("HTTP server closed");
    pool.end();
  });
});
