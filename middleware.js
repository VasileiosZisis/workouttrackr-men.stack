const ExpressError = require('./utils/ExpressError');
const {
  logSchema,
  exerciseSchema,
  sessionSchema,
} = require('./validations.js');
const Log = require('./models/log');
const Exercise = require('./models/exercise');
const Session = require('./models/session');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in');
    return res.redirect('/login');
  }
  next();
};

module.exports.isLogAuthor = async (req, res, next) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  if (!log) {
    req.flash('error', 'The log does not exist');
    return res.redirect('/logs');
  }
  if (!log.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect('/');
  }
  next();
};

module.exports.isExerciseAuthor = async (req, res, next) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  if (!log) {
    req.flash('error', 'The log does not exist');
    return res.redirect('/logs');
  }
  if (!log.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect('/');
  }
  if (!exercise) {
    req.flash('error', 'The excercise does not exist');
    return res.redirect(`/logs/${log.slugLog}`);
  }
  if (!exercise.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect('/');
  }
  next();
};

module.exports.isSessionAuthor = async (req, res, next) => {
  const session = await Session.findOne({
    slugSession: req.params.slugSession,
  });
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  if (!log) {
    req.flash('error', 'The log does not exist');
    return res.redirect('/logs');
  }
  if (!log.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect('/');
  }
  if (!exercise) {
    req.flash('error', 'The excercise does not exist');
    return res.redirect(`/logs/${log.slugLog}`);
  }
  if (!exercise.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect('/');
  }
  if (!session) {
    req.flash('error', 'The session does not exist');
    return res.redirect(
      `/logs/${log.slugLog}/exercises/${exercise.slugExercise}`
    );
  }
  if (!session.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect('/');
  }
  next();
};

module.exports.validateLog = (req, res, next) => {
  const { error } = logSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateExercise = (req, res, next) => {
  const { error } = exerciseSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateSession = (req, res, next) => {
  const { error } = sessionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
