const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const logModel = require("./models/logModel.js");

const app = express();

var corsOptions = {
  origin: "http://127.0.0.1:3001"
};

// Apply CORS options to Express App
app.use(cors(corsOptions));

// For requests of content-type application/json
app.use((bodyParser.json()));

// For requests of content-type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/api/:userId/logs", (req, res) => {
  // Retrieve log data by date
  let userId = req.params.userId;
  let date = req.query.date

  logModel.getLogEntries(userId, date)
    .then((dbResponse) => {
      res.status(200).json(dbResponse); 
    })
    .catch((error) => {
      console.log("NETWORK ERROR in app.get /logs:")
      console.log(error);
      res.status(500).send(error);
    })
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});