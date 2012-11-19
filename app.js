var express = require('express');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');


var app = express();

app.configure(function() {
  //app.register('dust', cons.dust);

  app.use(express.compress());
  //app.use(express.logger());
  app.use(express.static(__dirname+'/static'));
  app.use(express.methodOverride());
  app.use(express.bodyParser());

  app.use(app.router);
  app.set('view options', {layout: false});
  app.set('view engine', 'dust');

});

app.listen(8000);