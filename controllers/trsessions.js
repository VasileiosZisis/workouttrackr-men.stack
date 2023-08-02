const Log = require('../models/log');
const Exercise = require('../models/exercise');
const Trsession = require('../models/trsession');

module.exports.index = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  res.redirect(`/logs/${log.slugLog}/exercises/${exercise.slugExercise}`);
};

module.exports.newTrsessionForm = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });

  const showPrevious = await Exercise.aggregate([
    { $match: { _id: exercise._id } },
    {
      $lookup: {
        from: 'trsessions',
        localField: '_id',
        foreignField: 'exercise',
        as: 'trsessions',
      },
    },
    {
      $unwind: '$trsessions',
    },
    {
      $sort: { 'trsessions.createdDate': -1 },
    },
    {
      $limit: 1,
    },
  ]);

  res.render('trsessions/new', { log, exercise, showPrevious });
};

module.exports.createTrsession = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const trsession = new Trsession(req.body);
  trsession.author = req.user._id;
  trsession.exercise = exercise._id;
  trsession.log = log._id;
  await trsession.save();
  req.flash('success', 'New session has been created');
  res.redirect(
    `/logs/${log.slugLog}/exercises/${exercise.slugExercise}/trsessions`
  );
};

module.exports.showTrsession = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const trsession = await Trsession.findOne({
    slugSession: req.params.slugSession,
  }).populate('author');
  res.render('trsessions/show', { log, exercise, trsession });
};

module.exports.editTrsessionForm = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const trsession = await Trsession.findOne({
    slugSession: req.params.slugSession,
  });
  res.render('trsessions/edit', { log, exercise, trsession });
};

module.exports.updateTrsession = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const trsession = await Trsession.findOneAndUpdate(
    { slugSession: req.params.slugSession },
    { ...req.body },
    { new: true }
  );
  req.flash('success', 'Your changes have been saved');
  res.redirect(
    `/logs/${log.slugLog}/exercises/${exercise.slugExercise}/trsessions/${trsession.slugSession}`
  );
};

module.exports.deleteTrsession = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  await Trsession.findOneAndDelete({ slugSession: req.params.slugSession });
  req.flash('success', 'Session has been deleted');
  res.redirect(`/logs/${log.slugLog}/exercises/${exercise.slugExercise}`);
};
