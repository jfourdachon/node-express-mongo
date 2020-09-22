const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have an name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters']
      // Does not accept spaces so prefer regex
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'a tour must have an duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a maxgroupSize']
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        //Custom validator, priceDiscount < price
        // this only points to currents doc on NEW document creation
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      required: [true, 'a tour must have a summary'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'a tour must have a description'],
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'a tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    // Embeded fields (denormalization)
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    // Referencing -> normalization(relation)
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  // add virtuals to schema (Cannot being queried!!!)
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
//  Declare virtuals
// 'this' points to the current document
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// MONGOOSE DOCUMENT MIDDELWARE: runs before .save() and .create() ONLY
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Embeding guides
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// Middlewares .pre or .save can be chained
tourSchema.pre('save', function (next) {
  // console.log('Will dave document...');
  next();
});

// DOCUMENT MIDDELWARE: runs after .save() and .create() ONLY
tourSchema.post('save', function (doc, next) {
  // console.log({ doc });
  next();
});

// QUERY MIDDELWARE: Difference is only the hook (save or find)
// regex -> all strings that starts with find for all mongoose methods find...
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  // Populate guides fields which are renferenced with id in DB
  // Use it only when extremly needed -> slow performances
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

// runs after queries find...
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log({ docs });
  next();
});

//  AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // add $match to aggregation pipeline
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  //current aggregation obj
  console.log(this);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
