const express = require('express');
const app = express();
const cuid = require('cuid');
const fs = require("fs");
var mongoose = require('mongoose');
var isLocal = require('is-local-ip');
var isUrl = require('is-url');
var isip = require('isip');
var port = "3000";

var database = mongoose.createConnection('mongodb://138.197.114.14/UCS');

var Schema = mongoose.Schema;

//app.use('/css', express.static(__dirname + "/client/css"));

database.model('UCSServer', new Schema({
	cuid: String,
  ip: String,
  port: Number
}));
var UCSServer = database.model('UCSServer');

var isPort = function(port)
{
  if(!isNaN(port) && port >= 0 && port <= 65535)
  {
    return true;
  } else {
    return false;
  }
}

var newUCSServer = function(ip, port)
{
  var key = cuid();
  var server = new UCSServer({
  		cuid: key,
      ip: ip,
      port: port
  });
  server.save(function(error, data){});
  return key;
}

database.on("open", function(){
  console.log("Connected to UCS mongo database.");
})

app.get('/', function (req, res) {
  res.send(fs.readFileSync("./client/index.html").toString());
})

app.post('/createServer/:ip/:port', function(req, res){
  if(isLocal(req.params.ip))
  {
    res.redirect("../../error/0");
  } else if(!isUrl(req.params.ip) && !isip(req.params.ip)) {
    res.redirect("../../error/1");
  } else if(!isPort(req.params.port)) {
    res.redirect("../../error/2");
  } else {
    var key = newUCSServer(req.params.ip, req.params.port);
    res.redirect("../../success/"+key);
  }
})

app.get('/error/:error', function(req, res){
  var err;
  if(req.params.error == 0)
  {
    err = "You can't enter a localhost address for an IP!";
  } else if(req.params.error == 1){
    err = "You did not enter a valid IP!"
  } else if(req.params.error == 2) {
    err = "You do not have a valid port!"
  } else {
    err = "Unknow error, try again or contact the developers!"
  }
  var page = fs.readFileSync("./client/error.html").toString();
  res.send(page.replace("{{error}}", err));
});

app.get('/success/:key', function(req, res){
  var page = fs.readFileSync("./client/success.html").toString();
  res.send(page.replace("{{key}}", req.params.key));
})
//console.log( cuid() );

app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})
