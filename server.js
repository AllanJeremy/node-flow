const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var dotenv = require('dotenv');
const multer = require('multer');
const Joyn = express();

dotenv.config();

// image folder
const upload = multer({
  dest: 'images'
});

Joyn.use('/images', express.static('./images'));

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

// front routes
require('./app/routes/front')(Joyn);

// admin routes
require('./app/routes/admin')(Joyn);

// cron job
var cronJob = require('./app/cron');
cronJob = new cronJob();

var chatCronJob = require('./app/cron/chat.js');
chatCronJob = new chatCronJob();

// set port, listen for requests
const PORT = process.env.PORT || 3001;

Joyn.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  cronJob.start();
});
