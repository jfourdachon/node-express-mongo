const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// middleware put in route middleware for checking id
exports.checkId = (req, res, next, _value) => {
  if (parseInt(req.params.id, 10) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requesTime);
  res.status(200).json({
    status: 'succes',
    requestedAt: req.requesTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTourById = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id, 10));
  res.status(200).json({
    status: 'succes',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const { body } = req;
  const newTour = { id: newId, body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (_req, res) => {
  res.status(201).json({
    status: 'Success',
    data: {
      tour: 'Updated tour...',
    },
  });
};

exports.deleteTour = (_req, res) => {
  console.log('Deleting data......');
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
