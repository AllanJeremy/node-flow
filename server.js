const express = require("express");
const cors = require("cors");
var dotenv = require("dotenv");
const multer = require("multer");
const cron = require("node-cron");
const Joyn = express();

dotenv.config();

// image folder
const upload = multer({
  dest: "images",
});

Joyn.use("/images", express.static("./images"));

// Set CORS
Joyn.use(cors({ origin: process.env.CORS_ORIGIN }));

// parse requests of content-type - application/json
Joyn.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
Joyn.use(express.urlencoded({ extended: true }));

// Database
const db = require("./app/models");
db.sequelize.sync();

// route
Joyn.get("/", (req, res) => {
  res.json({
    message: "No route matches [GET] /",
  });
});

// front routes
require("./app/routes/front")(Joyn);

// admin routes
require("./app/routes/admin")(Joyn);

// cron job
var cronJob = require("./app/cron");
cronJob = new cronJob();

var chatCronJob = require("./app/cron/chat.js");
chatCronJob = new chatCronJob();

// Schedule tasks to be run on the server.
// cron.schedule('* * * * *', function() {
//   chatCronJob.ExportChannel();
// });

// cron.schedule('* * * * *', function() {
//   chatCronJob.GetMessages();
// });

// cron.schedule('* * * * *', function() {
//   chatCronJob.DeleteMessages();
// });

// set port, listen for requests
const PORT = process.env.PORT || 3001;

Joyn.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  cronJob.start();
});
