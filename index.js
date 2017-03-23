var express = require('express');
var wagner = require('wagner-core');

require('./models/models')(wagner);

var app = express();

//log in console
app.use(require('morgan')('dev'));

//public resources to be accessed by client html/js/css/img
app.use(express.static(__dirname + '/public'));

//authentication
wagner.invoke(require('./controllers/auth'), { app: app });

//api routes
app.use('/api', require('./controllers/main')(wagner));

//redirect to index.html page where angular will route internally
app.use('/*', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000);
console.log('Listening on port 3000!');