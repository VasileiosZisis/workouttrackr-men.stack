const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Session = require('./session');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const exerciseSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    slugExercise: { type: String, slug: 'title', unique: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

exerciseSchema.virtual('sessions', {
  ref: 'Session',
  localField: '_id',
  foreignField: 'exercise',
});

exerciseSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Session.deleteMany({
      exercise: doc._id,
    });
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
