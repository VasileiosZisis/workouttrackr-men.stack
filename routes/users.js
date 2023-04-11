const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');

router
  .route('/register')
  .get(users.registerUserForm)
  .post(catchAsync(users.createUser));

router
  .route('/login')
  .get(users.loginUserForm)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    users.loginUserPost
  );

router.get('/logout', users.logoutUser);

module.exports = router;
