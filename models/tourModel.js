const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name!'],
      trim: true,
      unique: true,
      maxlength: [
        40,
        ' A tour name must have less or equal than 40 characters! ',
      ],
      minlength: [
        10,
        ' A tour name must have more or equal than 10 characters! ',
      ],
      // validate: validator.isAlpha (Validator from external library)
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration!'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size!'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty!'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult!',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be higher than 1.0!'],
      max: [5, 'Rating must be lower than 5.0'],
      set: (vat) => {
        Math.round(val * 10) / 10;
      },
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price!'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'Price discount should be lower than the price itself!',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image!'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // Select basically hides the field
      // from the results.
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ading a index to certain fields to
// improve querying and readability.
tourSchema.index({ price: 1 });
// Adding a needed index for geospatial querying.
tourSchema.index({ startLocation: '2dsphere' });

// Adding a virtual property:
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document middleware (Runs before the .save() command.)
// In this case we're using it to give every doc a slug
// before saving it
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  console.log('Slug created!');
  next();
});

// Connecting users and tours by embedding:
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// Document middleware (Runs after the .save())
tourSchema.post('save', function (doc, next) {
  console.log('After being saved!', doc);
  next();
});

// Query middleware (before!)

tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Query middleware (after)

tourSchema.pre('find', function (next) {
  this.populate('guides');
  next();
});

tourSchema.post('find', function (doc, next) {
  // console.log(doc);
  next();
});

// Aggregation middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;
