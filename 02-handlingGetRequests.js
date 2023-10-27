const fs = require('fs');
const express = require('express');

const app = express();

// Middleware
app.use(express.json());
// express.json() here is a middleware and middleware is basically a function that can modify the incoming request data so it's called middleware because it stands between so in the middle of the request and the response so it's just a step that the request goes through while it's being processed

//from here ***** + look above
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
// __dirname --> where the current script located

// GET
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// POST
app.post('/api/v1/tours', (req, res) => {
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
});

//listening
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
