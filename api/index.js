const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const app = express();

var corsOptions = {
  origin: "http://127.0.0.1:3001"
};

// Apply CORS options to Express App
app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});