const router = require('express').Router();

router.get('/', (req, res) => {
  if (!req.session.sfid || !req.session.name) {
    res.redirect('/');
  } else {
    res.render('bye', { title: 'Bye', name: req.session.name });
  }
});

module.exports = router;
