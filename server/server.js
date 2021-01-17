// This statement imports the express code (which returns a function) that we will use to instantiate our application. 
const express = require('express');

//Multiple apps can be created that listen on different ports. 
//Lets create a single application server with this line of code. 
const app = express();

//This is a router (middleware) that will respond to a request with a file listed under a directory. 
//The directory it searches under is the directory that you pass to the express.static function. 
//In this case, the directory is 'public' and this directory is relative to where the app (this file) is being run. 
const fileServerMiddleware = express.static('public');

//We need to mount the above middleware to the application. We do this by using the app.use() function.  
//The '/' directory will default to this if left blank, we could leave it blank in this case. 
//The second option mounts the middleware to the application. 
app.use('/', fileServerMiddleware);

//We now need to tell our application to listen for requests on a specific port. 
//You use the app.listen() functiuon to do this. 
//The first argument is the port number, the second argument is an optional callback function. 
app.listen(3000, ()=> console.log('App started on port: 3000'));

//To start this application type npm start in the console. 