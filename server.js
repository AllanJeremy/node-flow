const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var dotenv = require('dotenv');

const Joyn = express();

dotenv.config();


const corsConst = process.env.NODE_ENV == 'development' ? cors() : cors({origin: process.env.originURL})

Joyn.use(
  corsConst
);

// parse requests of content-type - application/json
Joyn.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
Joyn.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require('./app/models');
db.sequelize.sync();

// route
Joyn.get("/", (req, res) => {
    res.json({ status: {"message":"No route matches [GET] \"/\"", "code": 404,  "error_type": "Exceptions::RoutingError"}});
});

// admin routes
const routes = require('./app/routes/admin');
Joyn.use('/admin', routes);


// set port, listen for requests
const PORT = process.env.PORT || 3001;

Joyn.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});