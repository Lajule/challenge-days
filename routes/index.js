const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'index' });
});

router.post('/', (req, res) => {
  if (!req.body.account) {
    res.render('index', {
      title: 'index',
      error: 'Please entrer your client identifier',
    });
  } else {
    const query =
      `SELECT a.sfid, a.name, c.code__c, c.accepted__c, c.visited__c
      FROM salesforce.account a, salesforce.challenge__c c
      WHERE a.sfid = c.account__c AND  a.accountnumber = $1`;

    const { pool }  = req.app.locals;
    pool.query(query, [req.body.account], (err, result) => {
      if (!result.rowCount) {
        res.render('index', {
          title: 'index',
          account: req.body.account,
          error: 'Unknown identifier',
        });
      } else {
        Object.assign(req.session, result.rows[0]);
        res.redirect('/code');
      }
    });
  }
});

module.exports = router;
