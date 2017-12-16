const router = require('express').Router();

router.get('/', (req, res) => {
  if (!req.session.name) {
    res.redirect('/');
  } else {
    res.render('code', { title: 'Code', name: req.session.name });
  }
});

router.post('/', (req, res) => {
  if (!req.session.name || !req.session.code__c) {
    res.redirect('/');
  } else {
    if (!req.body.code) {
      res.render('code', {
        title: 'Code',
        name: req.session.name,
        error: 'Please entrer your code',
      });
    } else {
      if (req.body.code != req.session.code__c) {
        res.render('code', {
          title: 'Code',
          name: req.session.name,
          code: req.body.code,
          error: 'Wrong password',
        });
      } else {
        req.session.granted = true;
        res.redirect('/answer');
      }
    }
  }
});

module.exports = router;
