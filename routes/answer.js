const router = require('express').Router();

router.get('/', (req, res) => {
  if (!req.session.name || !req.session.granted) {
    res.redirect('/');
  } else {
    res.render('answer', { title: 'Answer', name: req.session.name });
  }
});

router.post('/', (req, res) => {
  if (!req.session.name || !req.session.granted || !req.session.sfid) {
    res.redirect('/');
  } else {
    const accepted = req.body.answer == 'yes' ? 'TRUE' : 'FALSE';
    const query =
      `UPDATE salesforce.challenge__c
      SET accepted__c = ${accepted}, visited__c = TRUE
      WHERE account__c = $1`;

    const { pool }  = req.app.locals;
    pool.query(query, [req.session.sfid], (err, result) => {
      res.redirect('/finish');
    });
  }
});

module.exports = router;
