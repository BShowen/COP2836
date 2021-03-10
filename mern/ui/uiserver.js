require('dotenv').config();

const express = require('express');

const app = express();

//This is a proxy, which we are not using in this app. 
const proxy = require('http-proxy-middleware');

app.use(express.static('public'));

//This will setup the proxy. 
//If you want to use it then you define process.env.API_TARGET_PROXY
//in the .env file. 
const apiProxyTarget = process.env.API_PROXY_TARGET;
if (apiProxyTarget) {
  app.use('/graphql', proxy({ target: apiProxyTarget }));
}

const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3000';
//This syntax creates an object out of the string above. 
//The object has a key 'env' with the value of UI_API_ENDPOINT
const env = { UI_API_ENDPOINT };

//This is how we inject some JS into the index.html file. 
//We do this because we need and environment var called 'env' 
//in the front-end. The way we create the environment variable is by 
//converting the variable env (in this file a few lines up) into JSON
//and adding it as a global variable in the DOM. You add a global var to 
//the DOM by adding a variable to window with window.variableName = someData;
//as seed below. 
//Now, in the index.html file we have a script tag <script src='env.js'> like this. 
//We don't have a file called env.js, but the script tag makes a get request 
//which responds by adding a global variable to the DOM. 
app.get('/env.js', (req, res) => {
  res.send(`window.ENV = ${JSON.stringify(env)}`);
});


const port = process.env.UI_SERVER_PORT || 8000;

app.listen(port, () => {
  console.log(`UI started on port: ${port}`);
});
