# challenge-days

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

A typical Heroku Connect app

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
./node_modules/.bin/pm2 start index.js --name ChallengeDays --watch
```
