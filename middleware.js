const ExpressError = require('./utils/ExpressError');
const {
  logSchema,
  exerciseSchema,
  trsessionSchema,
} = require('./validations.js');
const Log = require('./models/log');
const Exercise = require('./models/exercise');
const Trsession = require('./models/trsession');

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

module.exports.isTrsessionAuthor = async (req, res, next) => {
  const trsession = await Trsession.findOne({
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
  if (!trsession) {
    req.flash('error', 'The session does not exist');
    return res.redirect(
      `/logs/${log.slugLog}/exercises/${exercise.slugExercise}`
    );
  }
  if (!trsession.author.equals(req.user._id)) {
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

module.exports.validateTrsession = (req, res, next) => {
  const { error } = trsessionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
