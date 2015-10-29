"use strict";
var config = require(process.env.PWD+'/config.js');

var morgan = require('morgan') // http logger
var logger = require("./logger.js");

var nexmo = require('easynexmo');
nexmo.initialize(config.NEXMO_APP_ID,config.NEXMO_APP_SECRET,'https',false);

var express     =   require('express');
var app         =   express();
var bodyParser  =   require('body-parser');
app.use(morgan('combined', { "stream": logger.stream }));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', "*");
    next();
});
var router = express.Router();
router.use(function(req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    next()
});


router.get('/', function(req, res){
    res.json({ message: 'Welcome to text-my-SAV! You must be fun, contact us for jobs @ArthurFlam' });
});


// enable per team here : https://github.com/mattermost/platform/blob/master/doc/integrations/webhooks/Outgoing-Webhooks.md
router.get('/hook/', function(req, res){
    var recipient = req.body.channel_name.split("|")[0].replace(/ /g,"");
    var sender    = req.body.channel_name.split("|")[1].replace(/ /g,"");
    nexmo.sendTextMessage(sender = sender,
			  recipient = recipient,
			  message = req.body.text.replace(/\/m[ ]+/,""),
			  null,
			  function(error, message){
			      logger.debug(message);
			      if(err){
				  res.send({ text: '❌'});				  
			      } else {
				  res.send({ text: '✅' });
			      }
			  })
});

// incoming sms
router.get('/sms/in', function(req, res){
    res.send("OK");
    logger.debug(req.query)
    var to=req.query.to;
    var team = config.TEAM_FROM_NUMBER[to];
    var payload={"text": req.query.msisdn,
		 "channel":from + " | " + team.phone,
		 "username":from,
		 "icon_url":"https://robohash.org/"+msisdn,
                }
    var url = team.webhook_url + team.webhook_key;
    request
        .post(url).send(payload)
        .end(function(err, result){logger.debug("sent hook :)");});
});

app.listen(config.PORT_INTERNAL, function(){
    logger.debug("App started, listenning on port "+config.PORT_INTERNAL);
});
