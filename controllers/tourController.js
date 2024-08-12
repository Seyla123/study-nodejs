/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
/* eslint-disable prefer-object-spread */
/* eslint-disable no-undef */
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../4-natours/starter/dev-data/data/tours-simple.json`));

const APIFeatures = require('../utils/apiFeature');

exports.getTourStats = catchAsync(async (req, res,next) => {
  const tours = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
      },
    }
  ]);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);
  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id == id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `Invalid ID : ${id}`,
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  console.log('Hello from the middleware !!!!!');
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};
exports.getToursAlias = async (req, res, next) => {
  req.query.sort = 'price';
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}
exports.getAllTours = catchAsync(async (req, res,next) => {
  const feature = new APIFeatures(Tour.find(), req.query).filter().sort().fields().pagination();
  const tours = await feature.query; 

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
  // try {
    // const tours = await Tour.find()
    //   .where('difficulty')
    //   .equals('easy');
    // const tours = await Tour.find();
  //   let query = Tour.find();
  //   if(req.query.sort){
  //     const sortBy = req.query.sort.split(',').join(' ');
  //     console.log('sort by :', sortBy);
  //     query = query.sort(sortBy);
  //   } else {
  //     query = query.sort('-createdAt');
  //   }
  //  if (req.query.fields) {
  //     const fields = req.query.fields.split(',').join(' ');
  
  //     console.log('sort by :', fields);
  //     query = query.select(fields);
  //  }else{
  //     query = query.select('-__v');
  //  }

  //  pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    // if(req.query.page){
    //   const numsTour = await Tour.countDocuments();
    //   if(skip>=numsTour) throw new Error('this page does not exist');
    // }
    // console.log('query :', query);
//   } catch (error) {
//     return res.status(404).json({
//       status: 'fail',
//       message: error.message,
//     });
//   }
// }
// exports.getAllTours = (req, res) => {
//   const reqDate = req.requestTime;
//   res.status(200).json({
//     status: 'success',
//     request: reqDate,
//     result: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// };
exports.getTour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findById(req.params.id);
  //const tour = await Tour.findOne({ name: req.params.id });
  console.log('non  non on nononononno');
  
  if(!tour){
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    results: tour.length,
    data: {
      tour,
    },
  });
});
// exports.getTour = (req, res) => {
//   const id = parseInt(req.params.id);
//   const tour = tours.find((tour) => tour.id == id);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tours: tour,
//     },
//   });
// };
exports.deleteTour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if(!tour){
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
// exports.deleteTour = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: null,
//   });
// };
exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if(!tour){
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    },
  });
});
// exports.updateTour = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tours: '<update tour  here ... >',
//     },
//   });
// };
// create tours with mongoose
exports.addTour = catchAsync(async (req, res,next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});
// exports.addTour = (req, res) => {
//   newtour = Object.assign({ id: tours.length }, req.body);
//   tours.push(newtour);
//   fs.writeFileSync(
//     `${__dirname}/../4-natours/starter/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newtour,
//         },
//       });
//     }
//   );
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: newtour,
//     },
//   });
// };
