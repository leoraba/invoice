const express = require('express');
const mongoose = require('mongoose');

console.log(`Running on Node version: ${process.versions.node}`);
var dataBaseConn = new Promise((resolve, reject) => {
    resolve(mongoose.connect('mongodb://localhost:27017/invoice', { useNewUrlParser: true, useCreateIndex: true }));
}).then(success => {
    const app = express();

    //log in console
    app.use(require('morgan')('dev'));

    //public resources to be accessed by client html/js/css/img
    app.use(express.static(__dirname + '/public'));

    //authentication
    require('./controllers/auth')(app);

    //api routes
    app.use('/api', require('./controllers/main')(app));

    //redirect to index.html page where angular will route internally
    app.use('/*', function(req, res){
        res.sendFile(__dirname + '/public/index.html');
    });

    app.listen(3000);
    console.log('Listening on port 3000!');
}, error => {
    console.log("Couldn't connect to MongoDB database.");
    console.log("Exit.");
});