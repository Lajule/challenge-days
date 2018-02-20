require('dotenv').config();

const express = require('express');
const expressSession = require('express-session');
const { json, urlencoded } = require('body-parser');
const { Pool } = require('pg');
const { Logger, transports: { Console } } = require('winston');

const app = express();

app.locals.pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

app.locals.logger = new Logger({
  transports: [
    new Console({ level: process.env.LEVEL })
  ]
});

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(expressSession({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use('/', require('./routes/index'));
app.use('/challenge', require('./routes/challenge'));
app.use('/bye', require('./routes/bye'));

const port = process.env.PORT;
const logger = app.locals.logger;
app.listen(port, () => logger.info(`Server listening on port ${port}`));
