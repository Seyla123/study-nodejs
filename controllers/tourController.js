/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
/* eslint-disable prefer-object-spread */
/* eslint-disable no-undef */
const fs = require('fs');
const Tour = require('../models/tourModel');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../4-natours/starter/dev-data/data/tours-simple.json`));

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
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
}
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
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //const tour = await Tour.findOne({ name: req.params.id });
    res.status(200).json({
      status: 'success',
      results: tour.length,
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
}
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
exports.deleteTour = async (req, res) => {
  try {
    // const tour = await Tour.deleteOne({ _id: req.params.id });
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
// exports.deleteTour = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: null,
//   });
// };
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
// exports.updateTour = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tours: '<update tour  here ... >',
//     },
//   });
// };
// create tours with mongoose
exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
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
