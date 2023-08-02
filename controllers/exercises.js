const Exercise = require('../models/exercise');
const Log = require('../models/log');

module.exports.index = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  res.redirect(`/logs/${log.slugLog}`);
};

module.exports.exerciseNewForm = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  res.render('exercises/new', { log });
};

module.exports.createExercise = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = new Exercise(req.body);
  exercise.author = req.user._id;
  log.exercises.push(exercise);
  await Promise.all([exercise.save(), log.save()]);
  req.flash('success', 'Successfully created a new excercise');
  res.redirect(`/logs/${log.slugLog}/exercises`);
};

module.exports.showExercise = async (req, res) => {
  const limit = 10;
  const page = req.query.page || 1;
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  const exerciseAggregate = await Exercise.aggregate([
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
      $sort: { 'trsessions._id': -1 },
    },
    {
      $skip: limit * page - limit,
    },
    {
      $limit: limit,
    },
  ]);

  const total = await Exercise.aggregate([
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
      $count: 'count',
    },
  ]);

  let totalDocuments;

  if (total.length) {
    totalDocuments = total[0].count;
  }

  let totalPages = Math.ceil(totalDocuments / limit);
  let currentPage = page;
  let startPage;
  let endPage;

  if (totalPages <= 10) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 6) {
      startPage = 1;
      endPage = 10;
    } else if (currentPage + 4 >= totalPages) {
      startPage = totalPages - 9;
      endPage = totalPages;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }
  }

  res.render('exercises/show', {
    log,
    exercise,
    exerciseAggregate,
    currentPage,
    totalPages,
    totalDocuments,
    startPage,
    endPage,
  });
};

module.exports.editExerciseForm = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  res.render('exercises/edit', { log, exercise });
};

module.exports.exerciseUpdate = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOneAndUpdate(
    {
      slugExercise: req.params.slugExercise,
    },
    { ...req.body },
    {
      new: true,
    }
  );
  req.flash('success', 'Your changes has been saved');
  res.redirect(`/logs/${log.slugLog}/exercises/${exercise.slugExercise}`);
};

module.exports.deleteExercise = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const exercise = await Exercise.findOne({
    slugExercise: req.params.slugExercise,
  });
  await Log.findByIdAndUpdate(log._id, {
    $pull: {
      exercises: exercise._id,
    },
  });
  await Exercise.findByIdAndDelete(exercise._id);
  req.flash('success', 'Excerice has been deleted');
  res.redirect(`/logs/${log.slugLog}`);
};
