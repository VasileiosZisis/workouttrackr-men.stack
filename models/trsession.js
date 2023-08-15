const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const trsessionSchema = new Schema(
  {
    createdDateRen: {
      type: Date,
      default: Date.now,
    },
    createdDate: {
      type: String,
      default: function () {
        return new Date().toISOString().slice(0, 10);
      },
    },
    slugSession: {
      type: String,
      slug: 'createdDate',
      unique: true,
      permanent: true,
    },
    weights: [
      new Schema({
        repetitions: Number,
        kilograms: Number,
        volume: {
          type: Number,
          default: function () {
            return (this.repetitions * this.kilograms).toFixed(2);
          },
        },
      }),
    ],
    totalVolume: {
      type: Number,
      default: function () {
        const result = this.weights.map((a) => a.volume);
        if (result.length) {
          return result.reduce((acc, cur) => acc + cur, 0);
        } else {
          return (result = 0);
        }
      },
    },
    exercise: {
      type: Schema.Types.ObjectId,
      ref: 'Exercise',
    },
    log: {
      type: Schema.Types.ObjectId,
      ref: 'Log',
    },
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

trsessionSchema.post('findOneAndUpdate', async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  const result = await docToUpdate.weights.map((a) => a.volume);
  docToUpdate.totalVolume = await result.reduce((acc, cur) => acc + cur, 0);
  await docToUpdate.save();
});

// trsessionSchema.virtual('totalVolume').get(function () {
//   const result = this.weights.map((a) => a.volume);
//   if (result.length) {
//     return result.reduce((acc, cur) => acc + cur, 0);
//   } else {
//     return (result = 0);
//   }
// });

module.exports = mongoose.model('Trsession', trsessionSchema);
