const express = require('express');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const { check, validationResult } = require('express-validator');

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
        req.flash(
          'error',
          'Something went wrong, your message could not be sent'
        );
        res.redirect('/contact');
      }
    }
  })
);

module.exports = router;
