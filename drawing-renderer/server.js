require('./instrument');

const express = require('express');
const lzString = require('lz-string');
const { Pool: PGPool } = require('pg');
const Sentry = require('@sentry/node');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const morgan = require('morgan');
const sh = require('shorthash');

const APP_PORT = 80;
const DATABASE_URL = process.env.DATABASE_URL;
const dbUrlRegexp =
  /^postgres:\/\/([^:@]+):?([^@]+)?@([^:\/]+):?(\d{2,5})?\/([a-zA-Z0-9_-]+)$/;
const dbParams = DATABASE_URL.match(dbUrlRegexp);

const pool = new PGPool({
  user: dbParams[1],
  password: dbParams[2] || process.env.DB_PASSWORD,
  host: dbParams[3],
  port: dbParams[4],
  database: dbParams[5],
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const app = express();

const logFormat = process.env.ENVIRONMENT === 'local' ? 'dev' : 'combined';
app.use(morgan(logFormat));

app.use(Sentry.Handlers.requestHandler());

app.use((req, res, next) => {
  let requestId = req.headers['x-request-id'];
  if (requestId) {
    Sentry.setTag('request_id', requestId);
  }
  next();
});

app.use(express.json({ limit: '1Mb' }));

app.get('/health', (req, res) => {
  res.send("I'm up!");
});

async function fetchDrawing(table, column, id, next) {
  try {
    const dbClient = await pool.connect();
    const dbResponse = await dbClient.query(
      `SELECT ${column} FROM ${table} WHERE uuid = $1`,
      [id],
    );
    if (!dbResponse.rows.length) {
      res.status(404).send('Not found!');
    }
    const encodedDrawing = dbResponse.rows[0][column];
    return lzString.decompressFromBase64(encodedDrawing);
  } catch (err) {
    next(err);
  } finally {
    await dbClient.release();
  }
}

async function sendPng(drawing, res) {
  const base64Data = drawing.replace('data:image/png;base64,', '');
  const buffer = Buffer.from(base64Data, 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-disposition': 'attachment;filename=' + id + '.png',
    'Content-Length': buffer.length,
    'Cache-Control': 'max-age=31556926',
  });
  res.end(buffer);
}

async function writePng(filePath, drawing) {
  // https://nodejs.org/en/knowledge/file-system/security/introduction/#preventing-directory-traversal
  const fullPath = path.join(
    process.env.DRAWING_RENDERER_STORAGE_PATH,
    filePath,
  );
  if (fullPath.indexOf(process.env.DRAWING_RENDERER_STORAGE_PATH) !== 0) {
    throw new Error(`That path looks sketchy: ${filePath}`);
  }

  const base64Data = drawing.replace('data:image/png;base64,', '');
  const buffer = Buffer.from(base64Data, 'base64');

  const directory = path.dirname(fullPath);
  await fs.promises.mkdir(directory, { recursive: true });
  await fs.promises.writeFile(fullPath, buffer, 'base64');

  const publicPath = process.env.DRAWING_RENDERER_PUBLIC_PATH + filePath;
  return publicPath;
}

app.get(
  '/drawings/:padStepId.png',
  asyncHandler(async (req, res, next) => {
    const drawing = await fetchDrawing(
      'core_padstep',
      'drawing',
      req.params.padStepId,
      next,
    );
    sendPng(drawing, res);
  }),
);

app.get(
  '/drawings/avatar/:playerId/:firstCharacters.png',
  asyncHandler(async (req, res, next) => {
    const drawing = await fetchDrawing(
      'core_player',
      'avatar',
      req.params.playerId,
      next,
    );
    sendPng(drawing, res);
  }),
);

app.post(
  '/drawings/:padStepId',
  asyncHandler(async (req, res) => {
    const drawing = lzString.decompressFromBase64(req.body.drawing);
    const subdir = req.params.padStepId.substring(0, 4);
    const path = `${subdir}/${req.params.padStepId}.png`;

    const publicPath = await writePng(path, drawing);

    res.status(201).send({ publicPath });
  }),
);

app.post(
  '/drawings/avatar/:playerId',
  asyncHandler(async (req, res) => {
    const drawing = lzString.decompressFromBase64(req.body.drawing);
    const hash = sh.unique(drawing);
    const subdir = req.params.playerId.substring(0, 4);
    const path = `${subdir}/${req.params.playerId}/${hash}.png`;

    const publicPath = await writePng(path, drawing);

    res.status(201).send({ publicPath });
  }),
);

Sentry.setupExpressErrorHandler(app);

const server = app.listen(APP_PORT, () => {
  console.log(`Drawing renderer listening at http://localhost:${APP_PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');

  server.close(() => {
    console.log('HTTP server closed');
    pool.end();
  });
});
