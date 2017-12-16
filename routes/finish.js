const router = require('express').Router();

router.get('/', (req, res) => {
  if (!req.session.name || !req.session.granted) {
    res.redirect('/');
  } else {
    res.render('finish', { title: 'Finish', name: req.session.name });
  }
});

module.exports = router;
