/**
 * Module dependencies.
 */
var express = require('express')
  , nowjs = require('now');
var db = require('mongojs').connect('nodemapdb', ['mycollection']);

var app = module.exports = express.createServer();
app.listen(80);

var everyone = nowjs.initialize(app,{socketio: {transports: ['xhr-polling', 'jsonp-polling']}});

everyone.now.logStuff = function(msg){
    console.log(msg);
};
everyone.now.addMarkerServer = function(msg){
	console.log(msg);
	db.mycollection.save({	owner : msg.owner,
			message : msg.message,
			latitude : msg.latitude,
			longitude: msg.longitude
		}, function (err, res) {
		// Handle response
		console.log(res);
	});
	everyone.now.addMarkerClient(msg);
};

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, res){
	
	var dataArray=[];
	db.mycollection.find({},{_id:0}).forEach(function(err, doc) {
		if (!doc) {
			// we visited all docs in the collection
			res.render('index', { title: 'NodeMap : Using Nodejs,Nowjs,Mongodb & Google Maps ' , messages : JSON.stringify(dataArray)});    
			return;
		}
		dataArray.push(doc);
	});

});

console.log("Express server listening on port 80");
