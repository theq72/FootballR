var express = require('express');
var app = express();
var router = express.Router();
var session = require('express-session');
var Player = require('../models/player');  	// The player model in MongoDB.

router.get('/select-player/:id', function(req,res,next) 
{

	//get player id from request 
	var playerId = req.params.id;

	// user = the logged on user
	var user = req.user;

	// find player and set isOwned to the users ID
	Player.findOneAndUpdate( 
	{id: playerId}, 
	{$set: {isOwned: user._id}}, 
	{new: true})

	// Success / error checking.
	.exec(function (err) 
	{

		// If there is an error drafting a player.
		if (err) 
		{

			// Send a message to console with error status.
			console.log("Failed to draft player: " + err);
			res.sendStatus(500);
			res.end();
			return;

		}

		// Otherwise, a player was drafted.
		res.end();
		console.log('Player drafted by user.');

	});

});

// Renders Draft page on website. 
router.get('/', function(req, res, next) 
{

	// Once requested, we respond by rendering 'Draft.handlebars'.
	res.render('Draft.handlebars', {});

});

router.post('/users', (req,res,next)=> 
{

	team = req.body.userList;

});

// Sends the logged in user id to the client.
router.get('/get-user', function(req, res)
{

	var user = req.user;
	res.send(user.id);
	console.log('Sent user id: ' + user.id);

})

// Queries Mongo for all players and sends to client as a JSON array.
router.get('/get-players', function(req, res) 
{

	// Find all Players in MongoDB; client needs undrafted and user's drafted.
	Player.find()

	// Sort by season projected points in descending order.
	.sort({ seasonProjectedPts: 'descending' })

	// Success / error checking.
	.exec(function (err, players) {

		// If there is an error getting data from DB.
		if (err) 
		{

			// Send a message to console with error status.
			console.log("Failed to query for players: " + err);
			res.sendStatus(500);
			res.end();
			return;

		}

		// Sends players array to client as a JSON string.
		res.send(players); 
		console.log('Players fetched.');		// Send message to console.

	});

});

// Draft player function


module.exports = router;
