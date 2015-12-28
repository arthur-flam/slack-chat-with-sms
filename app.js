"use strict";
var morgan = require('morgan') // http logger
var request = require('superagent');
var nexmo = require('easynexmo');
nexmo.initialize(config.NEXMO_APP_ID,config.NEXMO_APP_SECRET,'https',false);
var config = require('./config.js');
var logger = require("./logger.js");

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
app.use('/v1', router);
router.use(function(req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    next()
});


router.get('/', function(req, res){
    res.json({ message: 'Welcome to the API' });
});


function create_channel(channel_name, team, callback){
    var url = "https://slack.com/api/channels.create";
    var payload={"token": team.plateform_token,
		 "name":channel_name
                };
    request
        .get(url).query(payload)
        .end(function(err, result){
	    logger.debug("create channel:");
            logger.debug(result.body);
	    callback(err, result);
        });
}

function invite_channel(channel_name, user, team, callback){
    var url = "https://slack.com/api/channels.invite";
    var payload={"token": team.plateform_token,
                 "name":channel_name,
		 "user":user
                };
    request
        .get(url).query(payload)
        .end(function(err, result){
            logger.debug("invite channel:");
            logger.debug(result.body);
	    if(callback)
		callback(err, result);
        });
}


router.post('/hook', 
function(req, res){
    var team = config.TEAM_FROM_NAME[req.body.team_domain || req.query.team_domain];
    logger.debug("hook received for team"+team.name);
    if(req.body.token!==team.command_token){
	//res.send("invalid token"); // enable check ?
	//return;
    }
    var payload={"text": req.query.text || req.body.text,
                 "channel":'#' + (req.query.channel_name || req.body.channel_name),
                 "username":req.query.user_name || req.body.user_name,
                }
    var url = team.webhook_url + team.webhook_key;
    request
        .post(url).send(payload)
        .end(function(err, result){
            logger.debug(result.body);
            logger.debug(result.text);
            logger.debug(err);
        });
    var recipient = req.body.channel_name.split("-")[1].replace(/ /g,"").replace('#','');
    nexmo.sendTextMessage(team.phone,
			  recipient,
			  req.body.text.replace(/\/m[ ]+/,""),
			  null,
			  function(error, message){
			      logger.debug("from nexmo:");
			      if(error || message.messages[0].status !== '0' ){
				  res.send('❌');
			      } else {
				  res.send('✅');
			      }
			  }
)
});

router.get('/sms/in', function(req, res){
    res.send("OK");
    logger.debug(req.query)
    var to=req.query.to;
    var msisdn = req.query.msisdn;
    var team = config.TEAM_FROM_NUMBER[to];
    if(!team){
	logger.debug(req.body);
	return;
    }
    var channel = "sav" + "-" + msisdn;
    var payload={"text": req.query.text,
		 "channel":"#"+channel,
		 "username":msisdn,
		 "icon_url":"https://robohash.org/"+msisdn,
                }
    var url = team.webhook_url + team.webhook_key;
    create_channel(channel, team, function(err, result){
	invite_channel(channel, "louis", team);
	if(!err){
	    logger.debug("sending slack message")
	    logger.debug(url);
	    logger.debug(payload);
	    request
		.post(url).send(payload)
		.end(function(err, result){
		    logger.debug(result.body);		    
		    logger.debug(result.text);		    
		    logger.debug(err);		    
		});   
	}
    });
});

app.listen(config.PORT_INTERNAL, function(){
    logger.debug("App started, listenning on port "+config.PORT_INTERNAL);
});
