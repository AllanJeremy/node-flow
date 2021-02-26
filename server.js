const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var dotenv = require('dotenv');

const Joyn = express();

dotenv.config();

Joyn.use(function (req, res, next) {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


Joyn.use(cors());
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

Joyn.use(cors(corsOpts));

Joyn.options("*", cors());

Joyn.use(cors({origin: '*'}));

Joyn.use(cors({
  allowedHeaders: [ 'Accept-Version', 'Authorization', 'Credentials', 'Content-Type' ]
}));

// parse requests of content-type - application/json
Joyn.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
Joyn.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require('./app/models');
db.sequelize.sync();

// route
Joyn.get("/", (req, res) => {
    res.json({ message: 'Welcome to Joyn Connect.' });
});

// admin routes 
const routes = require('./app/routes/admin');
Joyn.use('/admin', routes);


// set port, listen for requests
const PORT = process.env.PORT || 3001;

Joyn.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});