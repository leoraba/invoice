var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/invoice');

var app = express();

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