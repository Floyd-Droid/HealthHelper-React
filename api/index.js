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
  let date = req.query.date;

  try {
    const dbResult = await logModel.getLogEntries(userId, date)
    const code = dbResult.error ? 500 : 200;
    res.status(code).json(dbResult); 
  } catch (err) {
    console.log(err)
    res.status(500).send();
  }
});

app.put('/api/:userId/logs', async (req, res) => {
  const userId = req.params.userId;
  const date = req.query.date;
  const body = req.body;

  try {
    const dbResult = await logModel.updateLogEntries(body, userId, date);
    res.status(200).json(dbResult);
  } catch (err) {
    console.log(err)
    res.status(500).send();
  } 
})

app.delete('/api/:userId/logs', async (req, res) => {
  const userId = req.params.userId;
  const date = req.query.date;

  try {
    const dbResult = await logModel.deleteLogEntries(req.body, userId, date);
    res.status(200).json();
  } catch(err) {
    console.log(err)
    res.status(500).send();
  }
})


// Index endpoints
app.get('/api/:userId/index', async (req, res) => {
  const userId = req.params.userId;

  try {
    const dbResult = await indexModel.getIndexEntries(userId);
    console.log('db result: ', dbResult)
    const code = dbResult.error ? 500 : 200;
    res.status(code).json(dbResult); 
  } catch (err) {
    console.log(err)
    res.status(500).send();
  }
})

app.post('/api/:userId/index', async (req, res) => {
  const body = req.body;
  const userId = req.params.userId;

  try {
    const dbResult = await indexModel.createIndexEntries(body, userId);
    res.status(200).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
})

app.put('/api/:userId/index', async (req, res) => {
  const userId = req.params.userId;
  const body = req.body;

  try {
    const dbResult = await indexModel.updateIndexEntries(body, userId);
    res.status(200).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
})

app.delete('/api/:userId/index', async (req, res) => {
  const userId = req.params.userId;
  const entryIds = req.body;

  console.log('DELETE')

  try {
    const dbResult = await indexModel.deleteIndexEntries(entryIds, userId);
    res.status(200).json(dbResult);
  } catch(err) {
    console.log(err);
    res.status(500).send();
  }

})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});