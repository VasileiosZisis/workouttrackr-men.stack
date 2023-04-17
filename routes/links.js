const express = require('express');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const { check, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/contact', isLoggedIn, (req, res) => {
  res.render('contact');
});

const contactValidate = [
  check('name').isLength({ min: 2 }).trim().escape(),
  check('email').isEmail().trim().escape().normalizeEmail(),
  check('message').isLength({ min: 2 }).trim().escape(),
];

router.post(
  '/contact',
  contactValidate,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    const msg = {
      to: 'vasil.zisis@gmail.com',
      from: req.body.email,
      subject: 'Track-My-Progress Contact Form',
      text: req.body.message,
      html: req.body.message,
    };
    if (!errors.isEmpty()) {
      req.flash(
        'error',
        'Something went wrong, your message could not be sent'
      );
      return res.status(400).redirect('/contact');
    } else {
      try {
        await sgMail.send(msg);
        req.flash('success', 'Your message was sent');
        res.redirect('/contact');
      } catch (e) {
        req.flash('error', e.message);
        res.redirect('/contact');
      }
    }
  })
);

router.get('/forgot', function (req, res) {
  res.render('forgot');
});

router.post(
  '/forgot',
  catchAsync(async (req, res, next) => {
    async.waterfall(
      [
        function (done) {
          crypto.randomBytes(20, function (err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function (token, done) {
          User.findOne({ email: req.body.email }, function (err, user) {
            if (!user) {
              req.flash('error', 'No account with that email address exists.');
              return res.redirect('/forgot');
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          });
        },
        function (token, user, done) {
          const msg = {
            to: user.email,
            from: 'vasil.zisis@gmail.com',
            subject: 'Password Reset',
            text:
              'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' +
              req.headers.host +
              '/reset/' +
              token +
              '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n',
            html:
              'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' +
              req.headers.host +
              '/reset/' +
              token +
              '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n',
          };
          try {
            sgMail.send(msg);
            req.flash(
              'success',
              'An e-mail has been sent to ' +
                user.email +
                ' with further instructions.'
            );
            res.redirect('/forgot');
          } catch (e) {
            req.flash('error', e.message);
            res.redirect('/forgot');
          }
        },
      ],
      function (err) {
        if (err) return next(err);
      }
    );
  })
);

router.get('/reset/:token', function (req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', { token: req.params.token });
    }
  );
});

router.get('/reset/:token', function (req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', { token: req.params.token });
    }
  );
});

router.post(
  '/reset/:token',
  catchAsync(async (req, res) => {
    async.waterfall(
      [
        function (done) {
          User.findOne(
            {
              resetPasswordToken: req.params.token,
              resetPasswordExpires: { $gt: Date.now() },
            },
            function (err, user) {
              if (!user) {
                req.flash(
                  'error',
                  'Password reset token is invalid or has expired.'
                );
                return res.redirect('/forgot');
              }
              if (req.body.password === req.body.confirm) {
                user.setPassword(req.body.password, function (err) {
                  user.resetPasswordToken = undefined;
                  user.resetPasswordExpires = undefined;

                  user.save(function (err) {
                    req.logIn(user, function (err) {
                      done(err, user);
                    });
                  });
                });
              } else {
                req.flash('error', 'Passwords do not match.');
                return res.redirect('/forgot');
              }
            }
          );
        },
        function (user, done) {
          const msg = {
            to: user.email,
            from: 'vasil.zisis@gmail.com',
            subject: 'Your password has been changed',
            text:
              'Hello,\n\n' +
              'This is a confirmation that the password for your account ' +
              user.email +
              ' has just been changed.\n',
            html:
              'Hello,\n\n' +
              'This is a confirmation that the password for your account ' +
              user.email +
              ' has just been changed.\n',
          };
          try {
            sgMail.send(msg);
            req.flash('success', 'Success! Your password has been changed.');
            res.redirect('/login');
          } catch (e) {
            req.flash('error', e.message);
            res.redirect('/error');
          }
        },
      ],
      function (err) {
        res.redirect('/error');
      }
    );
  })
);

module.exports = router;
