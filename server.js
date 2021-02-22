const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var dotenv = require('dotenv');

const app = express();

dotenv.config();

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require('./app/models');
db.sequelize.sync();

// route
app.get("/", (req, res) => {
    res.json({ message: 'Welcome to Joyn Connect.' });
});

// admin routes 
const routes = require('./app/routes/admin');
app.use('/api/v1/admin', routes);


// set port, listen for requests
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});