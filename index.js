const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

console.log(`Running on Node version: ${process.versions.node}`);
var dataBaseConn = new Promise((resolve, reject) => {
    const dbPort = config.get("database.port");
    const dbName = config.get("database.name");
    const dbPrefix = config.get("database.prefix");
    const dbHost = config.get("database.host");
    const dbUser = config.get("database.username");
    const dbPass = config.get("database.password");
    const dbOptions = config.get("database.options");
    const dbEnv = config.get("database.env");
    if(dbEnv == "local"){
      resolve(mongoose.connect(`${dbPrefix}://${dbHost}:${dbPort}/${dbName}`, { useNewUrlParser: true, useCreateIndex: true }));
    }else if(dbEnv == "atlas"){
      resolve(mongoose.connect(`${dbPrefix}://${dbUser}:${dbPass}@${dbHost}/${dbName}?${dbOptions}`, { useNewUrlParser: true, useCreateIndex: true }));
    }else{
      reject("Unsupported MongoDB configuration (" + dbEnv + ")");
    }
}).then(success => {
    const httpPort = config.get("port");
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

    app.listen(httpPort);
    console.log(`Listening on port ${httpPort}!`);
}).catch(error => {
    console.log(error);
    console.log("Exit.");
    process.exit(1);
});