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

const defaultError = {errorMessage: 'An error occurred. Please check that your changes were saved.'};

// Log endpoints
app.get('/api/:userId/logs', async (req, res) => {
  const userId = req.params.userId;
  const date = req.query.date;

  try {
    const dbResult = await logModel.getLogEntries(userId, date);
    const code = typeof dbResult.errorMessage === 'undefined' ? 200 : 500;
    res.status(code).json(dbResult); 
  } catch (err) {
    console.log(err)
    const body = {errorMessage: `An error occurred. Please check your connection and try again.`};
    res.status(500).json(body);
  }
});

app.post('/api/:userId/logs', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;
  const date = req.query.date;
	
  try {
    const dbResult = await logModel.createLogEntries(entries, userId, date);
    res.status(201).json(dbResult);
  } catch(err) {
    console.log(err);
    res.status(500).json(defaultError);
  }
})

app.put('/api/:userId/logs', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;
  const date = req.query.date;

  try {
    const dbResult = await logModel.updateLogEntries(entries, userId, date);
    res.status(200).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(defaultError);
  } 
})

app.delete('/api/:userId/logs', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;
  const date = req.query.date;

  try {
    const dbResult = await logModel.deleteLogEntries(entries, userId, date);
    res.status(200).json(dbResult);
  } catch(err) {
    console.log(err);
    res.status(500).json(defaultError);
  }
})


// Index endpoints
app.get('/api/:userId/index', async (req, res) => {
  const userId = req.params.userId;

  try {
    const dbResult = await indexModel.getIndexEntries(userId);
    const code = typeof dbResult.errorMessage === 'undefined' ? 200 : 500;
    res.status(code).json(dbResult);
  } catch (err) {
    console.log(err);
    const body = {errorMessage: `An error occurred. Please check your connection and try again.`};
    res.status(500).json(body);
  }
})

app.post('/api/:userId/index', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;
	
  try {
    const dbResult = await indexModel.createIndexEntries(entries, userId);
    res.status(201).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(defaultError);
  }
})

app.put('/api/:userId/index', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;

  try {
    const dbResult = await indexModel.updateIndexEntries(entries, userId);
    res.status(200).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(defaultError);
  }
})

app.delete('/api/:userId/index', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;
  
  try {
    const dbResult = await indexModel.deleteIndexEntries(entries, userId);
    res.status(200).json(dbResult);
  } catch(err) {
    console.log(err);
    res.status(500).json(defaultError);
  }

})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});