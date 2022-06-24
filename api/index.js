import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

import * as logModel from './models/logModel.js';
import * as indexModel from './models/indexModel.js';
import { verifyFirebaseIdToken } from './firebase.js';

const PORT = process.env.PORT || 3001;
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
	errorMessage: 'An error occurred. Please check that your changes were saved.'
};

const connectionErrorResult = {
	errorMessage: 'An error occurred. Please check your connection and try again.'
};

// Log endpoints
app.get('/api/log', async (req, res) => {
  const date = req.query.date;

  try {
		const decodedToken = await verifyFirebaseIdToken(req);
    const dbResult = await logModel.getLogEntries(decodedToken.uid, date);
    const code = typeof dbResult.errorMessage === 'undefined' ? 200 :500;
    res.status(code).json(dbResult); 
  } catch (err) {
    console.log(err);
    res.status(500).json(connectionErrorResult);
  }
});

app.post('/api/log', async (req, res) => {
	const entries = req.body;
  const date = req.query.date;
	
  try {
		const decodedToken = await verifyFirebaseIdToken(req);
    const dbResult = await logModel.createLogEntries(entries, decodedToken.uid, date);
		const code = typeof dbResult.successMessage !== 'undefined' ? 201 : 500;

		if (typeof dbResult.errorMessage !== 'undefined') {
			dbResult.successMessage = undefined;
		}
		
    res.status(code).json(dbResult);
  } catch(err) {
    console.log(err);
    res.status(500).json(defaultErrorResult);
  }
})

app.put('/api/log', async (req, res) => {
	const entries = req.body;
  const date = req.query.date;

  try {
		const decodedToken = await verifyFirebaseIdToken(req);
    const dbResult = await logModel.updateLogEntries(entries, decodedToken.uid, date);
		const code = typeof dbResult.successMessage !== 'undefined' ? 200 : 500;

		if (typeof dbResult.errorMessage !== 'undefined') {
			dbResult.successMessage = undefined;
		}

    res.status(code).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(defaultErrorResult);
  } 
})

app.delete('/api/log', async (req, res) => {
	const entries = req.body;
  const date = req.query.date;

  try {
		const decodedToken = await verifyFirebaseIdToken(req);
    const dbResult = await logModel.deleteLogEntries(entries, decodedToken.uid, date);
		const code = typeof dbResult.successMessage !== 'undefined' ? 200 : 500;

		if (typeof dbResult.errorMessage !== 'undefined') {
			dbResult.successMessage = undefined;
		}

    res.status(code).json(dbResult);
  } catch(err) {
    console.log(err);
    res.status(500).json(defaultErrorResult);
  }
})


// Index endpoints
app.get('/api/index', async (req, res) => {
  try {
		const decodedToken = await verifyFirebaseIdToken(req);
    const dbResult = await indexModel.getIndexEntries(decodedToken.uid);
    const code = typeof dbResult.errorMessage !== 'undefined' ? 500 : 200;

    res.status(code).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(connectionErrorResult);
  }
})

app.post('/api/index', async (req, res) => {
	const entries = req.body;
	
  try {
		const decodedToken = await verifyFirebaseIdToken(req);
    const dbResult = await indexModel.createIndexEntries(entries, decodedToken.uid);
		const code = typeof dbResult.successMessage !== 'undefined' ? 201 : 500;

		if (typeof dbResult.errorMessage !== 'undefined') {
			dbResult.successMessage = undefined;
		}

    res.status(code).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(defaultErrorResult);
  }
})

app.put('/api/index', async (req, res) => {
	const entries = req.body;

  try {
		const decodedToken = await verifyFirebaseIdToken(req);
    const dbResult = await indexModel.updateIndexEntries(entries, decodedToken.uid);
		const code = typeof dbResult.successMessage !== 'undefined' ? 200 : 500;

		if (typeof dbResult.errorMessage !== 'undefined') {
			dbResult.successMessage = undefined;
		}

    res.status(code).json(dbResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(defaultErrorResult);
  }
})

app.delete('/api/index', async (req, res) => {
	const entries = req.body;
  
  try {
		const decodedToken = await verifyFirebaseIdToken(req);
    const dbResult = await indexModel.deleteIndexEntries(entries, decodedToken.uid);
		const code = typeof dbResult.successMessage !== 'undefined' ? 200 : 500;

		if (typeof dbResult.errorMessage !== 'undefined') {
			dbResult.successMessage = undefined;
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