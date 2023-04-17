const User = require('../models/user');

module.exports.registerUserForm = (req, res) => {
  res.render('users/register');
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ username });
    if (password.length >= 6) {
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash('success', 'Register successfull');
        res.redirect('/logs');
      });
    } else {
      req.flash('error', 'Password must be at least 6 characters long');
      res.redirect('/register');
    }
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/');
  }
};

module.exports.loginUserForm = (req, res) => {
  res.render('users/login');
};

module.exports.loginUserPost = (req, res) => {
  req.flash('success', 'Login successfull');
  res.redirect('/logs');
};

module.exports.logoutUser = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logout successfull');
    res.redirect('/');
  });
};
