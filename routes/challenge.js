const router = require("express").Router();

router.get("/", (req, res) => {
  if (!req.session.sfid || !req.session.name) {
    res.redirect("/");
  } else {
    res.render("challenge", { title: "Challenge", name: req.session.name });
  }
});

router.post("/", (req, res) => {
  if (!req.session.sfid || !req.session.name) {
    res.redirect("/");
  } else {
    const accepted = req.body.answer === "yes";
    const query = `UPDATE salesforce.challenge__c
      SET accepted__c = $1, visited__c = TRUE
      WHERE account__c = $2`;

    const { pool } = req.app.locals;
    pool.query(query, [accepted, req.session.sfid], (err, result) => {
      res.redirect("/bye");
    });
  }
});

module.exports = router;
