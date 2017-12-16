require('dotenv').config();

const express = require('express');
const expressSession = require('express-session');
const { json, urlencoded } = require('body-parser');
const { Pool } = require('pg');

const app = express();

app.locals.pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
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
app.listen(port, () => console.log(`Server listening on port ${port}`));
