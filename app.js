var express = require('express');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var expressUglify = require('express-uglify');

var app = express();

app.configure(function() {
  //app.register('dust', cons.dust);

  app.use(express.compress());
  app.use(expressUglify.middleware({
        src : __dirname + '/static',
        logLevel: 'none',
        }));

  app.use(express.static(__dirname+'/static'));
  app.use(express.methodOverride());
  app.use(express.bodyParser());

  app.use(app.router);
  app.set('view options', {layout: false});
  app.set('view engine', 'dust');
});

app.listen(8000);
