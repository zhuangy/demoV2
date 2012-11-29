var express = require('express');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var gzippo = require('gzippo');
var app = express();


app.configure(function() {
        app.use(gzippo.staticGzip(__dirname + '/static'));
        app.use(gzippo.compress());
        app.use(express.methodOverride());
        app.use(express.bodyParser());
        app.use(app.router);
        app.set('view options', {
                layout: false
        });
        app.set('view engine', 'dust');
});

app.listen(8000);
