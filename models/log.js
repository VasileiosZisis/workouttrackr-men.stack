const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Exercise = require('./exercise');
const Trsession = require('./trsession');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const LogSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    slugLog: { type: String, slug: 'title', unique: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    exercises: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],
  },
  { timestamps: true }
);

LogSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Exercise.deleteMany({
      _id: {
        $in: doc.exercises,
      },
    });
  }
});

LogSchema.virtual('Trsessions', {
  ref: 'Trsession',
  localField: '_id',
  foreignField: 'log',
});

LogSchema.post('findOneAndDelete', async function (docTr) {
  if (docTr) {
    await Trsession.deleteMany({
      log: docTr._id,
    });
  }
});

module.exports = mongoose.model('Log', LogSchema);
