"use strict";
var config = require(process.env.PWD+'/config.js');


var morgan = require('morgan') // http logger
var logger = require("./logger.js");


var express     =   require('express');
var app         =   express();
var bodyParser  =   require('body-parser');
app.use(morgan('combined', { "stream": logger.stream }));
app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', "*");
    next();
});


router.use(function(req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    next()
});


router.get('/', function(req, res){
    res.json({ message: 'Welcome to text-my-SAV! You must be fun, contact us for jobs @ArthurFlam' });
});


router.get('/hook/reply', function(req, res){
    res.json({ message: 'Welcome to text-my-SAV! You must be fun, contact us for jobs @ArthurFlam' });
});
// incomming hook: to, text, from
//    send back confirmation in text
//    send sms to user


// incoming sms
router.get('/sms/in', function(req, res){
    res.send("OK");
    var to=req.query.to;
    var from=req.query.from;
    var text=req.query.text;
    var team = config.team_from_number[to];
    send_hook()
});

// send hook to mattermost
//    in team given by to number
//    in channel given by from number
//    ?give user info
//    text is text
//    ?give info from orders
//    ?classify in channel with info, or prompt someone


app.listen(config.PORT_INTERNAL, function(){
    logger.debug("App started, listenning on port "+config.PORT_INTERNAL);
});
