# challenge-days

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

A typical Heroku Connect app built around [Express][1]. Note that other libraries are also used:

* [pug][2] as view engine
* [node-postgres][3] as PostgreSQL client
* [winston][4] as logger

## Running locally

To run the application locally, you have to create a `.env` file using the following command:

```sh
cp .env.exemple .env
```

Then modify the values in the file to match your environment.

Install project dependencies with:

```sh
npm install
```

To launch the application with `npm` as Heroku does, run:

```sh
npm start
```

You may also use `pm2` to watch changes in order to restart the application automatically:

```sh
npx pm2 start index.js --name ChallengeDays --watch
```

[1]: https://expressjs.com/ "Express"
[2]: https://pugjs.org/ "Pug"
[3]: https://node-postgres.com/ "node-postgres"
[4]: https://github.com/winstonjs/winston "winston"
