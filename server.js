const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var dotenv = require('dotenv');
const Joyn = express();

dotenv.config();

// Set CORS
Joyn.use(cors({ origin: process.env.CORS_ORIGIN }));

Joyn.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
Joyn.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
Joyn.use(bodyParser.json());

// Database
const db = require('./app/models');
db.sequelize.sync();

// route
Joyn.get('/', (req, res) => {
  res.json({
    'message': 'No route matches [GET] /'
  });
});

// admin routes
const routes = require('./app/routes/admin');
Joyn.use('/admin', routes);

// set port, listen for requests
const PORT = process.env.PORT || 3001;

Joyn.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
