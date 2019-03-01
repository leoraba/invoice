const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

console.log(`Running on Node version: ${process.versions.node}`);
var dataBaseConn = new Promise((resolve, reject) => {
    const dbPort = config.get("database.port");
    const dbName = config.get("database.name");
    resolve(mongoose.connect(`mongodb://localhost:${dbPort}/${dbName}`, { useNewUrlParser: true, useCreateIndex: true }));
}).then(success => {
    const app = express();

    //log in console
    const logLevel = config.get("log.level");
    app.use(require('morgan')(logLevel));

    //public resources to be accessed by client html/js/css/img
    app.use(express.static(__dirname + '/frontend/public'));

    //authentication
    require('./backend/controllers/auth')(app);

    //api routes
    app.use('/api', require('./backend/controllers/main')(app));

    //redirect to index.html page where angular will route internally
    app.use('/*', function(req, res){
        res.sendFile(__dirname + '/frontend/public/index.html');
    });

    const httpPort = config.get("port");
    app.listen(httpPort);
    console.log(`Listening on port ${httpPort}!`);
}).catch(error => {
    console.log(error);
    console.log("Exit.");
    process.exit(1);
});