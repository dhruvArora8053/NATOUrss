const fs = require('fs');
const express = require('express');

const app = express();

// Middleware
// from here ****
app.use(express.json());
// so in order to use middleware we use app.use so the use method is the one that we use in order to actually use middleware so this express.json() here calling this json method bascially returns a function and that function is then added to the middleware stack and so similar to that we can create our own middleware function so let's do that now:
app.use((req, res, next) => {
  console.log('Hello from the middleware');

  //now we actually need to call the next function and if we didn't call next here well then the request/response cycle would really be stuck at this point we wouldn't be able to move on and we would never ever send back a response to the client so I can't stress enough how important it is to never forget to use next in all of your middleware
  next();
});
// now indeed we have 'Hello from the middleware logged to our console', this middleware applies to each and every single request and that's because we didn't specify any route so remember that before I said that all route handlers here are actually kind of middleware themselves, they are simply middleare functions that only apply for a ceratain URL so a certain route but these above middlewares they are going to apply to every single request atleast if the route handler comes before this middleware, look below

//another one
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString; 
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
// __dirname --> where the current script located

// GET
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  //converting string to a number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  //   if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  //   console.log(req.body);
  // body is a property that is gonna be available on the request because we used that middleware a couple of moments ago

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
      // 201 status code: for created
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    // 204 --> no content
    status: 'success',
    data: null,
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });
// now we don't have 'Hello from the Middleware', it is because above route handler comes before this middleware function that we have here and above route handler which in this case is getAllTours actually ends the request response cycle and so the next middleware in the stack which in this is our custom above one will then not be called again because the cycle has already be finished so make sure to understand that this order really matters a lot in express

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//listening
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
