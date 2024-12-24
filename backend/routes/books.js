const router = require('express').Router();

router.get('/latest', (req, res) => {
  res.send('Latest books');
});

module.exports = router;