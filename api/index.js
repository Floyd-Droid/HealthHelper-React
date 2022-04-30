const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const logModel = require('./models/logModel.js');
const indexModel = require('./models/indexModel.js');

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


// Log endpoints
app.get("/api/:userId/logs", async (req, res) => {
  // Retrieve log data by date
  let userId = req.params.userId;
  let date = req.query.date

  try {
    const dbResult = await logModel.getLogEntries(userId, date)
    res.status(200).json(dbResult); 
  } catch (err) {
    res.status(500).send(err);
  }
});


// Index endpoints
app.get('/api/:userId/index', async (req, res) => {
  const userId = req.params.userId;
  try {
    const dbResult = await indexModel.getIndexEntries(userId);
    console.log(dbResult)
    res.status(200).json(dbResult);
  } catch (err) {
    res.status(500).send(err);
  }
})

app.put('/api/:userId/index', async (req, res) => {
  const userId = req.params.userId;
  const body = req.body

  try {
    const dbResult = await indexModel.updateIndexEntries(body, userId);
    res.status(200).json(dbResult);
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});