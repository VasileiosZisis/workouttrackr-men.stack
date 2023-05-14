const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const trsessionSchema = new Schema(
  {
    createdDate: {
      type: Date,
      default: Date.now,
    },
    slugSession: {
      type: String,
      slug: 'createdAt',
      unique: true,
      permanent: true,
      transform: (v) => v.toLocaleDateString(),
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
  { timestamps: true }
);

module.exports = mongoose.model('Trsession', trsessionSchema);
