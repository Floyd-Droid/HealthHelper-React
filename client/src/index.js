import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

process.env.NODE_ENV === 'production' && 
	Sentry.init({
		dsn: "https://0ad27e0de98f4e6a9ed018ae8a591aea@o1298392.ingest.sentry.io/6528707",
		integrations: [new BrowserTracing()],
		tracesSampleRate: 0,
	});

ReactDOM.render(
  <React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
