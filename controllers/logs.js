const Log = require('../models/log');

module.exports.index = async (req, res) => {
  const limit = 10;
  const page = req.query.page || 1;
  const logs = await Log.find({})
    .sort({ updatedAt: -1, createdAt: -1 })
    .skip(limit * page - limit)
    .limit(limit);
  const totalDocuments = await Log.estimatedDocumentCount({});

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
  res.render('logs/index', {
    logs,
    currentPage,
    totalPages,
    totalDocuments,
    startPage,
    endPage,
  });
};

module.exports.newForm = (req, res) => {
  res.render('logs/new');
};

module.exports.createLog = async (req, res, next) => {
  const log = new Log(req.body);
  log.author = req.user._id;
  await log.save();
  req.flash('success', 'Successfully created a new log');
  res.redirect(`logs`);
};

module.exports.showLog = async (req, res) => {
  const limit = 10;
  const page = req.query.page || 1;
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  const logAggregate = await Log.aggregate([
    { $match: { _id: log._id } },
    {
      $lookup: {
        from: 'exercises',
        localField: 'exercises',
        foreignField: '_id',
        as: 'exercises',
      },
    },
    {
      $unwind: '$exercises',
    },
    {
      $project: { 'exercises.sessions': 0 },
    },
    {
      $sort: { 'exercises.updatedAt': -1, 'exercises.createdAt': -1 },
    },
    {
      $skip: limit * page - limit,
    },
    {
      $limit: limit,
    },
  ]);

  const total = await Log.aggregate([
    { $match: { _id: log._id } },
    {
      $lookup: {
        from: 'exercises',
        localField: 'exercises',
        foreignField: '_id',
        as: 'exercises',
      },
    },
    {
      $unwind: '$exercises',
    },
    {
      $count: 'count',
    },
  ]);

  let totalDocuments;

  if (total.length) {
    totalDocuments = total[0].count;
  } else {
    totalDocuments = 0;
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
  res.render('logs/show', {
    log,
    logAggregate,
    currentPage,
    totalPages,
    totalDocuments,
    startPage,
    endPage,
  });
};

module.exports.editLogForm = async (req, res) => {
  const log = await Log.findOne({ slugLog: req.params.slugLog });
  res.render('logs/edit', { log });
};

module.exports.updateLog = async (req, res) => {
  const log = await Log.findOneAndUpdate(
    { slugLog: req.params.slugLog },
    { ...req.body },
    {
      returnDocument: 'after',
    }
  );
  req.flash('success', 'Your changes has been saved');
  res.redirect(`/logs/${log.slugLog}`);
};

module.exports.deleteLog = async (req, res) => {
  await Log.findOneAndDelete({ slugLog: req.params.slugLog });
  req.flash('success', 'Log has been deleted');
  res.redirect('/logs');
};
