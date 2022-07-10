import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import * as logModel from './models/logModel.js';
import * as indexModel from './models/indexModel.js';
import { verifyFirebaseIdToken } from './firebase.js';

const PORT = process.env.PORT || 3001;
const app = express();

//process.env.NODE_ENV === 'production' && 
Sentry.init({
  dsn: "https://489968792d5f4ff59eea055d447e235e@o1298392.ingest.sentry.io/6528710",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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
		const decodedTokenResult = await verifyFirebaseIdToken(req);
		if (typeof decodedTokenResult.errorMessage !== 'undefined') {
			res.status(401).json(decodedTokenResult); 
		} else {
			const dbResult = await logModel.getLogEntries(decodedTokenResult.uid, date);
			const code = typeof dbResult.errorMessage === 'undefined' ? 200 :500;
			
			res.status(code).json(dbResult); 
		}
  } catch (err) {
    res.status(500).json(connectionErrorResult);
  }
});

app.post('/api/log', async (req, res) => {
	const entries = req.body;
  const date = req.query.date;
	
  try {
		const decodedTokenResult = await verifyFirebaseIdToken(req);

		if (typeof decodedTokenResult.errorMessage !== 'undefined') {
			res.status(401).json(decodedTokenResult);
		} else {
			const dbResult = await logModel.createLogEntries(entries, decodedTokenResult.uid, date);
			const code = typeof dbResult.successMessage !== 'undefined' ? 201 : 500;
	
			if (typeof dbResult.errorMessage !== 'undefined') {
				dbResult.successMessage = undefined;
			}
			
			res.status(code).json(dbResult);
		}
  } catch(err) {
    res.status(500).json(defaultErrorResult);
  }
})

app.put('/api/log', async (req, res) => {
	const entries = req.body;
  const date = req.query.date;

  try {
		const decodedTokenResult = await verifyFirebaseIdToken(req);

		if (typeof decodedTokenResult.errorMessage !== 'undefined') {
			res.status(401).json(decodedTokenResult);
		} else {
    const dbResult = await logModel.updateLogEntries(entries, decodedTokenResult.uid, date);
		const code = typeof dbResult.successMessage !== 'undefined' ? 200 : 500;

		if (typeof dbResult.errorMessage !== 'undefined') {
			dbResult.successMessage = undefined;
		}

    res.status(code).json(dbResult);
		}
  } catch (err) {
    res.status(500).json(defaultErrorResult);
  } 
})

app.delete('/api/log', async (req, res) => {
	const entries = req.body;
  const date = req.query.date;

  try {
		const decodedTokenResult = await verifyFirebaseIdToken(req);

		if (typeof decodedTokenResult.errorMessage !== 'undefined') {
			res.status(401).json(decodedTokenResult);
		} else {
			const dbResult = await logModel.deleteLogEntries(entries, decodedTokenResult.uid, date);
			const code = typeof dbResult.successMessage !== 'undefined' ? 200 : 500;
	
			if (typeof dbResult.errorMessage !== 'undefined') {
				dbResult.successMessage = undefined;
			}
	
			res.status(code).json(dbResult);
		}
  } catch(err) {
    res.status(500).json(defaultErrorResult);
  }
})


// Index endpoints
app.get('/api/index', async (req, res) => {
  try {
		const decodedTokenResult = await verifyFirebaseIdToken(req);

		if (typeof decodedTokenResult.errorMessage !== 'undefined') {
			res.status(401).json(decodedTokenResult);
		} else {
			const dbResult = await indexModel.getIndexEntries(decodedTokenResult.uid);
			const code = typeof dbResult.errorMessage !== 'undefined' ? 500 : 200;
	
			res.status(code).json(dbResult);
		}
  } catch (err) {
    res.status(500).json(connectionErrorResult);
  }
})

app.post('/api/index', async (req, res) => {
	const entries = req.body;
	
  try {
		const decodedTokenResult = await verifyFirebaseIdToken(req);

		if (typeof decodedTokenResult.errorMessage !== 'undefined') {
			res.status(401).json(decodedTokenResult);
		} else {
			const dbResult = await indexModel.createIndexEntries(entries, decodedTokenResult.uid);
			const code = typeof dbResult.successMessage !== 'undefined' ? 201 : 500;
	
			if (typeof dbResult.errorMessage !== 'undefined') {
				dbResult.successMessage = undefined;
			}
	
			res.status(code).json(dbResult);
		}
  } catch (err) {
    res.status(500).json(defaultErrorResult);
  }
})

app.put('/api/index', async (req, res) => {
	const entries = req.body;

  try {
		const decodedTokenResult = await verifyFirebaseIdToken(req);

		if (typeof decodedTokenResult.errorMessage !== 'undefined') {
			res.status(401).json(decodedTokenResult);
		} else {
			const dbResult = await indexModel.updateIndexEntries(entries, decodedTokenResult.uid);
			const code = typeof dbResult.successMessage !== 'undefined' ? 200 : 500;
	
			if (typeof dbResult.errorMessage !== 'undefined') {
				dbResult.successMessage = undefined;
			}
	
			res.status(code).json(dbResult);
		}
  } catch (err) {
    res.status(500).json(defaultErrorResult);
  }
})

app.delete('/api/index', async (req, res) => {
	const entries = req.body;
  
  try {
		const decodedTokenResult = await verifyFirebaseIdToken(req);

		if (typeof decodedTokenResult.errorMessage !== 'undefined') {
			res.status(401).json(decodedTokenResult);
		} else {
			const dbResult = await indexModel.deleteIndexEntries(entries, decodedTokenResult.uid);
			const code = typeof dbResult.successMessage !== 'undefined' ? 200 : 500;
	
			if (typeof dbResult.errorMessage !== 'undefined') {
				dbResult.successMessage = undefined;
			}
	
			res.status(code).json(dbResult);
		}
  } catch(err) {
    res.status(500).json(defaultErrorResult);
  }
})

app.use(
	Sentry.Handlers.errorHandler({
		shouldHandleError(error) {
			if (error.status >= 400) {
				return true;
			}
			return false;
		},
	})
);

app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});