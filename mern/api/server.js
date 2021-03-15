require('dotenv').config();
// This statement imports the express code (which returns a function)
// that we will use to instantiate our application.
const express = require('express');
const { connectToDb } = require('./db.js');
const { installHandler } = require('./api_handler.js');

const app = express();

installHandler(app);

const port = process.env.API_SERVER_PORT || 3000;

// This weird looking syntax is an immediately invoked async function expression.
// You define the async function within (here)();
(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port: ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());