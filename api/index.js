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

const defaultErrorResult = {
	successMessages: [], 
	errorMessages: ['An error occurred. Please check that your changes were saved.']
};

const connectionErrorResult = {
	successMessages: [],
	errorMessages: ['An error occurred. Please check your connection and try again.'],
};

// Log endpoints
app.get('/api/:userId/log', async (req, res) => {
  const userId = req.params.userId;
  const date = req.query.date;

  try {
    const dbResult = await logModel.getLogEntries(userId, date);
    const code = dbResult.errorMessages.length ? 500 : 200;
    res.status(code).json(dbResult); 
  } catch (err) {
    console.log(err);
    res.status(500).json(connectionErrorResult);
  }
});

app.post('/api/:userId/log', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;
  const date = req.query.date;
	
  try {
    const dbResult = await logModel.createLogEntries(entries, userId, date);
		const code = dbResult.successMessages.length ? 201 : 500;

		if (dbResult.errorMessages.length) {
			dbResult.successMessages = [];
		}
		
    res.status(code).json(dbResult);
  } catch(err) {
    console.log(err);
    res.status(500).json(defaultErrorResult);
  }
})

app.put('/api/:userId/log', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;
  const date = req.query.date;

  try {
    const dbResult = await logModel.updateLogEntries(entries, userId, date);
		const code = dbResult.successMessages.length ? 200 : 500;

		if (dbResult.errorMessages.length) {
			dbResult.successMessages = [];
		}

    res.status(code).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(defaultErrorResult);
  } 
})

app.delete('/api/:userId/log', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;
  const date = req.query.date;

  try {
    const dbResult = await logModel.deleteLogEntries(entries, userId, date);
		const code = dbResult.successMessages.length ? 200 : 500;

		if (dbResult.errorMessages.length) {
			dbResult.successMessages = [];
		}

    res.status(200).json(dbResult);
  } catch(err) {
    console.log(err);
    res.status(500).json(defaultErrorResult);
  }
})


// Index endpoints
app.get('/api/:userId/index', async (req, res) => {
  const userId = req.params.userId;

  try {
    const dbResult = await indexModel.getIndexEntries(userId);
    const code = dbResult.errorMessages.length ? 500 : 200;
    res.status(code).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(connectionErrorResult);
  }
})

app.post('/api/:userId/index', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;
	
  try {
    const dbResult = await indexModel.createIndexEntries(entries, userId);
		const code = dbResult.successMessages.length ? 201 : 500;

		if (dbResult.errorMessages.length) {
			dbResult.successMessages = [];
		}

    res.status(code).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(defaultErrorResult);
  }
})

app.put('/api/:userId/index', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;

  try {
    const dbResult = await indexModel.updateIndexEntries(entries, userId);
		const code = dbResult.successMessages.length ? 200 : 500;

		if (dbResult.errorMessages.length) {
			dbResult.successMessages = [];
		}

    res.status(code).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(defaultErrorResult);
  }
})

app.delete('/api/:userId/index', async (req, res) => {
	const entries = req.body;
  const userId = req.params.userId;
  
  try {
    const dbResult = await indexModel.deleteIndexEntries(entries, userId);
		const code = dbResult.successMessages.length ? 200 : 500;

		if (dbResult.errorMessages.length) {
			dbResult.successMessages = [];
		}

    res.status(code).json(dbResult);
  } catch(err) {
    console.log(err);
    res.status(500).json(defaultErrorResult);
  }

})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});