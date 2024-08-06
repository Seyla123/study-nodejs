/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
/* eslint-disable prefer-object-spread */
/* eslint-disable no-undef */
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../4-natours/starter/dev-data/data/tours-simple.json`));
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
exports.getAllTours = (req, res) => {
  const reqDate = req.requestTime;
  res.status(200).json({
    status: 'success',
    request: reqDate,
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};
exports.getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id == id);
  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};
exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: null,
  });
};
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours: '<update tour  here ... >',
    },
  });
};
exports.addTour = (req, res) => {
  newtour = Object.assign({ id: tours.length }, req.body);
  tours.push(newtour);
  fs.writeFileSync(
    `${__dirname}/../4-natours/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newtour,
        },
      });
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      tour: newtour,
    },
  });
};
