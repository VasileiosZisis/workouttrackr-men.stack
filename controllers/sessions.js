const Log = require('../models/log');
const Exercise = require('../models/exercise');
const Session = require('../models/session');

module.exports.index = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  res.redirect(`/logs/${log.slugLog}/exercises/${exercise.slugExercise}`);
};

module.exports.newSessionForm = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  res.render('sessions/new', { log, exercise });
};

module.exports.createSession = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const session = new Session(req.body);
  session.author = req.user._id;
  session.exercise = exercise._id;
  await session.save();
  req.flash('success', 'New session has been created');
  res.redirect(
    `/logs/${log.slugLog}/exercises/${exercise.slugExercise}/sessions`
  );
};

module.exports.showSession = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const session = await Session.findOne({
    slugSession: req.params.slugSession,
  }).populate('author');
  res.render('sessions/show', { log, exercise, session });
};

module.exports.editSessionForm = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const session = await Session.findOne({
    slugSession: req.params.slugSession,
  });
  res.render('sessions/edit', { log, exercise, session });
};

module.exports.updateSession = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const session = await Session.findOneAndUpdate(
    { slugSession: req.params.slugSession },
    { ...req.body },
    { returnDocument: 'after' }
  );
  req.flash('success', 'Your changes have been saved');
  res.redirect(
    `/logs/${log.slugLog}/exercises/${exercise.slugExercise}/sessions/${session.slugSession}`
  );
};

module.exports.deleteSession = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  await Session.findOneAndDelete({ slugSession: req.params.slugSession });
  req.flash('success', 'Session has been deleted');
  res.redirect(`/logs/${log.slugLog}/exercises/${exercise.slugExercise}`);
};
