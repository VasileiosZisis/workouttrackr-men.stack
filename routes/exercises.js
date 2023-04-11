const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const exercises = require('../controllers/exercises');
const {
  isLoggedIn,
  validateExercise,
  isExerciseAuthor,
} = require('../middleware');

router
  .route('/')
  .get(isLoggedIn, catchAsync(exercises.index))
  .post(isLoggedIn, validateExercise, catchAsync(exercises.createExercise));

router.get('/new', isLoggedIn, exercises.exerciseNewForm);

router
  .route('/:slugExercise')
  .get(isLoggedIn, isExerciseAuthor, catchAsync(exercises.showExercise))
  .put(
    isLoggedIn,
    isExerciseAuthor,
    validateExercise,
    catchAsync(exercises.exerciseUpdate)
  )
  .delete(isLoggedIn, isExerciseAuthor, catchAsync(exercises.deleteExercise));

router.get(
  '/:slugExercise/edit',
  isLoggedIn,
  isExerciseAuthor,
  catchAsync(exercises.editExerciseForm)
);

module.exports = router;
