const express = require('express');

const app = express();
//express is a function which upon calling will add a bunch of methods to our app variable here

//Remember: routing means basically to determine how an application responds to a certain client request, so to a certain url and actually it's not just a url but also the http method which is used for that request
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint');
});

//listening
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
