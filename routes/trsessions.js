const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const trsessions = require('../controllers/trsessions');

const {
  isLoggedIn,
  validateTrsession,
  isExerciseAuthor,
  isTrsessionAuthor,
} = require('../middleware');

router
  .route('/')
  .get(isLoggedIn, catchAsync(trsessions.index))
  .post(isLoggedIn, validateTrsession, catchAsync(trsessions.createTrsession));

router.get('/new', isLoggedIn, isExerciseAuthor, trsessions.newTrsessionForm);

router
  .route('/:slugSession')
  .get(isLoggedIn, isTrsessionAuthor, catchAsync(trsessions.showTrsession))
  .put(
    isLoggedIn,
    isTrsessionAuthor,
    validateTrsession,
    catchAsync(trsessions.updateTrsession)
  )
  .delete(
    isLoggedIn,
    isTrsessionAuthor,
    catchAsync(trsessions.deleteTrsession)
  );

router.get(
  '/:slugSession/edit',
  isLoggedIn,
  isTrsessionAuthor,
  catchAsync(trsessions.editTrsessionForm)
);

module.exports = router;
