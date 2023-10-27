const fs = require('fs');
const express = require('express');

const app = express();
//express is a function which upon calling will add a bunch of methods to our app variable here

//from here *****
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
// __dirname --> where the current script located

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//listening
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
