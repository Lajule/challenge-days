const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'index' });
});

router.post('/', (req, res) => {
  if (!req.body.account || !req.body.code) {
    res.render('index', {
      title: 'index',
      account: req.body.account,
      code: req.body.code,
      error: 'Please entrer required informations',
    });
  } else {
    const query = `SELECT a.sfid, a.name
      FROM salesforce.account a, salesforce.challenge__c c
      WHERE a.sfid = c.account__c AND a.accountnumber = $1 AND c.code__c = $2`;

    const { pool }  = req.app.locals;
    pool.query(query, [req.body.account, req.body.code], (err, result) => {
      if (!result.rowCount) {
        res.render('index', {
          title: 'index',
          account: req.body.account,
          code: req.body.code,
          error: 'Wrong client identifier or activation code',
        });
      } else {
        Object.assign(req.session, result.rows[0]);
        res.redirect('/challenge');
      }
    });
  }
});

module.exports = router;
