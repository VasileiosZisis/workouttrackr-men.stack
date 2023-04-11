const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const logs = require('../controllers/logs');
const { isLoggedIn, validateLog, isLogAuthor } = require('../middleware');

router
  .route('/')
  .get(isLoggedIn, catchAsync(logs.index))
  .post(isLoggedIn, validateLog, catchAsync(logs.createLog));

router.get('/new', isLoggedIn, logs.newForm);

router
  .route('/:slugLog')
  .get(isLoggedIn, isLogAuthor, catchAsync(logs.showLog))
  .put(isLoggedIn, isLogAuthor, validateLog, catchAsync(logs.updateLog))
  .delete(isLoggedIn, isLogAuthor, catchAsync(logs.deleteLog));

router.get(
  '/:slugLog/edit',
  isLoggedIn,
  isLogAuthor,
  catchAsync(logs.editLogForm)
);

module.exports = router;
