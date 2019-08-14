var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Player = require('../models/player');

var currWeek = 3;	// Hardcoded for now

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	User.find({})
	.exec(function (err, users) {

	res.render('standings.handlebars', {userList: users});
	})
});

// Go to /standings/update to manually update the recorded w/l/t for all users
router.get('/update', function(req, res) {
	// Start by fetching all users from database.
	User.find({}, function(err, users) {
		if (err) {
			handleErr(res, err);
		}

		// Then fetch all players from database.
		Player.find({}, function(err, players) {
			if (err) {
				handleErr(res, err);
			}
			// Remove undrafted players
			var temp = [];
			for (var i = 0; i < players.length; i++) {
				if (players[i].isOwned !== 'N/A') {
					temp.push(players[i]);
				}
			}
			players = temp;

			// Calculate weekly point totals for each user.
			// For now, week 3's point totals will be used for all weeks' matchups.
			var pointSums = [];
			for (var i = 0; i < users.length; i++) {
				var sum = 0;
				users[i].wins = 0;	// Initialize these to 0 in case Mongo stores them as undefined to start
				users[i].losses = 0;
				users[i].ties = 0;
				for (var j = 0; j < players.length; j++) {
					if (players[j].isOwned == users[i].id && players[j].active == 1) {
						sum += players[j].weekPts;
					}
				}
				pointSums.push(sum);	// By index, each sum will correspond 1:1 to each user in users
			}

			// For each week, match up users and determine w/l/t for each
			for (var week = 1; week <= currWeek; week++) {
				// Iterate through each matchup in current order, update w/l/t in users array
				for (var i = 0; i < (users.length/2); i++) {
					var userA = i;
					var userB = users.length - 1 - i;
					if (pointSums[userA] > pointSums[userB]) {
						users[userA].wins++;
						users[userB].losses++;
					}
					else if (pointSums[userB] > pointSums[userA]) {
						users[userB].wins++;
						users[userA].losses++;
					}
					else {
						users[userA].ties++;
						users[userB].ties++;
					}
				}
				// Reorder users and pointSums (to keep index parity) with round robin algorithm
				var lastE = users.pop();  // Remove last element, store in lastE
				var lastS = pointSums.pop();
				users.splice(1, 0, lastE);  // Insert last element into position 1, creates new order
				pointSums.splice(1, 0, lastS);
			}

			// For each user, calculate win percentage and update stats in database
			for (var i = 0; i < users.length; i++) {
				users[i].WinPerc = users[i].wins / currWeek * 100;
				User.findOneAndUpdate( 
					{_id: users[i].id}, 
					{$set: {wins: users[i].wins, losses: users[i].losses, 
						ties: users[i].ties, WinPerc: users[i].WinPerc}}, 
					{new: true})
				.exec(function (err) {
					if (err) {
						handleErr(res, err);
					}
					console.log(users[i].username + ' stats updated.');
				});
			}

			// If this point is reached, everything probably worked!
			console.log('Stats updated.');
			res.send('Stats udpated.');
		});	// Player.find
	});	// User.find
});	// router.get('/update')

function handleErr(response, error) {
	console.log('Query failed: ' + error);
	response.sendStatus(500);
	response.end();
	return;
}

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;