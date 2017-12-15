require('dotenv').config()

const express = require('express')
const expressSession = require('express-session')
const { json, urlencoded } = require('body-parser')
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

const app = express()
app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static(__dirname + '/public'))
app.use(urlencoded({ extended: false }))
app.use(json())
app.use(expressSession({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}))

app.get('/', (req, res) => {
  res.render('index', { title: 'index' })
})

app.post('/', (req, res) => {
  if (!req.body.account) {
    res.render('index', {
      title: 'index',
      error: 'Please entrer your client identifier'
    })
  }
  else {
    const query =
      `SELECT a.sfid, a.name, c.password__c, c.accepted__c, c.visited__c
      FROM salesforce.account a, salesforce.challenge__c c
      WHERE a.sfid = c.account__c AND  a.accountnumber = $1`;

    pool.query(query, [req.body.account], (err, result) => {
      if (!result.rowCount) {
        res.render('index', {
          title: 'index',
          account: req.body.account,
          error: 'Unknown identifier'
        })
      }
      else {
        Object.assign(req.session, result.rows[0])
        res.redirect('/password')
      }
    })
  }
})

app.get('/password', (req, res) => {
  if (!req.session.name) {
    res.redirect('/')
  }
  else {
    res.render('password', { title: 'Password', name: req.session.name })
  }
})

app.post('/password', (req, res) => {
  if (!req.session.name || !req.session.password__c) {
    res.redirect('/');
  }
  else {
    if (!req.body.password) {
      res.render('password', {
        title: 'Password',
        name: req.session.name,
        error: 'Please entrer your password'
      })
    }
    else {
      if (req.body.password != req.session.password__c) {
        res.render('password', {
          title: 'Password',
          name: req.session.name,
          password: req.body.password,
          error: 'Wrong password'
        })
      }
      else {
        req.session.granted = true
        res.redirect('/answer')
      }
    }
  }
})

app.get('/answer', (req, res) => {
  if (!req.session.name || !req.session.granted) {
    res.redirect('/')
  }
  else {
    res.render('answer', { title: 'Answer', name: req.session.name })
  }
})

app.post('/answer', (req, res) => {
  if (!req.session.name || !req.session.granted || !req.session.sfid) {
    res.redirect('/')
  }
  else {
    const accepted = req.body.answer == 'yes' ? 'TRUE' : 'FALSE'
    const query =
      `UPDATE salesforce.challenge__c
      SET accepted__c = ${accepted}, visited__c = TRUE
      WHERE account__c = $1`

    pool.query(query, [req.session.sfid], (err, result) => {
      res.render('finish', { title: 'Finish', name: req.session.name })
    })
  }
})

const port = process.env.PORT
app.listen(port, () => console.log(`Server listening on port ${port}`))
