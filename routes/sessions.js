const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const sessions = require('../controllers/sessions');

const {
  isLoggedIn,
  validateSession,
  isExerciseAuthor,
  isSessionAuthor,
} = require('../middleware');

router
  .route('/')
  .get(isLoggedIn, catchAsync(sessions.index))
  .post(isLoggedIn, validateSession, catchAsync(sessions.createSession));

router.get('/new', isLoggedIn, isExerciseAuthor, sessions.newSessionForm);

router
  .route('/:slugSession')
  .get(isLoggedIn, isSessionAuthor, catchAsync(sessions.showSession))
  .put(
    isLoggedIn,
    isSessionAuthor,
    validateSession,
    catchAsync(sessions.updateSession)
  )
  .delete(isLoggedIn, isSessionAuthor, catchAsync(sessions.deleteSession));

router.get(
  '/:slugSession/edit',
  isLoggedIn,
  isSessionAuthor,
  catchAsync(sessions.editSessionForm)
);

module.exports = router;
