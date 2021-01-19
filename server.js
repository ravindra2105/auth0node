var express = require('express');
var app = express();

var fs = require('fs');
//var http = require('http');
var https = require('https');
var axios = require("axios").default;

var privateKey  = fs.readFileSync('./server.key', 'utf8');
var certificate = fs.readFileSync('./server.cert', 'utf8');
const { join } = require("path");
const morgan = require("morgan");
const helmet = require("helmet");

const creds = require('./auth_config.json');
//console.log(creds.domain);

var credentials = {key: privateKey, cert: certificate};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "public")));

app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});

app.post("/logout", (req,res) => {
  console.log(req);
  res.send('ddddd');
});

app.post("/changepassword", (req,res) => {

  var options = {
    method: 'POST',
    url: 'https://'+creds.domain+'/dbconnections/change_password',
    headers: {'content-type': 'application/json'},
    data: {
      client_id: creds.clientId,
      email: req.body.email,
      connection: 'Username-Password-Authentication'
    }
  };
  console.log(req.body.email);
  axios.request(options).then(function (response) {        
    console.log(response.data);
    res.send(response.data);
  }).catch(function (error) {
    console.error(error);
    res.send(error);
  });  
});

app.get("/*", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});


// your express configuration here
//var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

//httpServer.listen(8080);
httpsServer.listen(3000);


process.on("SIGINT", function() {
  process.exit();
});


module.exports = app;
