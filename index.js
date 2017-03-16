var express = require('express');
var wagner = require('wagner-core');

require('./models/models')(wagner);

var app = express();

app.use(express.static(__dirname + '/public'));

app.use('/', require('./controllers/main')(wagner));

app.use('/*', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000);
console.log('Listening on port 3000!');