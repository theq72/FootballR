var express = require('express');
var router = express.Router();
var async = require('async');

var Player = require('../models/player')
var User = require('../models/user');
var ObjectId = require('mongodb').ObjectID;

var currWeek = 3;  // Hardcoded for now

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	var user = req.user;
	var oppID;

	// Query database for all users then call getOpponent passing the current user and user list
	User.find({}, function (err, userList) {
		if (err) {
			console.log("Failed to query for users: " + err);
			res.sendStatus(500);
			res.end();
			return;
		}
		oppID = getOpponent(user, userList);

		// Once user and opponent are known, make a bunch of queries getting each user's team data
		async.parallel ([

			function(callback) {
			User.findOne({_id : oppID}, 
				function (err, opp){
					if (err) return callback(err);
					oppName = opp;
					callback();
				});
			},

			function(callback) {
			Player.find({ $and: [
				{isOwned: user.id},{active: 1}, {position: "QB"}]},
				function(err,actQB) {
					if(err) return callback (err);
					qbAct = actQB;
					callback();
				});
			},

			function(callback) {
			Player.find({ $and: [
				{isOwned: user.id},{active: 1}, {position: "RB"}]},
				function(err,actRB) {
					if(err) return callback (err);
					rbAct = actRB;
					callback();
				});
			},


			function(callback) {
			Player.find({ $and: [
				{isOwned: user.id},{active: 1}, {position: "WR"}]},
				function(err,actWR) {
					if(err) return callback (err);
					wrAct = actWR;
					callback();
				});
			},

			function(callback) {
			Player.find({ $and: [
				{isOwned: user.id},{active: 1}, {position: "TE"}]},
				function(err,actTE) {
					if(err) return callback (err);
					teAct = actTE;
					callback();
				});
			},

			function(callback) {
			Player.find({ $and: [
				{isOwned: user.id},{active: 1}, {position: "K"}]},
				function(err,actK) {
					if(err) return callback (err);
					kAct = actK;
					callback();
				});
			},

			function(callback) {
			Player.find({ $and: [
				{isOwned: user.id},{active: 1}, {position: "DEF"}]},
				function(err,actDEF) {
					if(err) return callback (err);
					defAct = actDEF;
					callback();
				});
			},

			function(callback) {
			Player.find({ $and: [
				{isOwned: oppID},{active: 1}, {position: "QB"}]},
				function(err,oppQB) {
					if(err) return callback (err);
					oppQbAct = oppQB;
					callback();
				});
			},

			function(callback) {
			Player.find({ $and: [
				{isOwned: oppID},{active: 1}, {position: "RB"}]},
				function(err,oppRB) {
					if(err) return callback (err);
					oppRbAct = oppRB;
					callback();
				});
			},


			function(callback) {
			Player.find({ $and: [
				{isOwned: oppID},{active: 1}, {position: "WR"}]},
				function(err,oppWR) {
					if(err) return callback (err);
					oppWrAct = oppWR;
					callback();
				});
			},

			function(callback) {
			Player.find({ $and: [
				{isOwned: oppID},{active: 1}, {position: "TE"}]},
				function(err,oppTE) {
					if(err) return callback (err);
					oppTeAct = oppTE;
					callback();
				});
			},

			function(callback) {
			Player.find({ $and: [
				{isOwned: oppID},{active: 1}, {position: "K"}]},
				function(err,oppK) {
					if(err) return callback (err);
					oppKAct = oppK;
					callback();
				});
			},

			function(callback) {
			Player.find({ $and: [
				{isOwned: oppID},{active: 1}, {position: "DEF"}]},
				function(err,oppDEF) {
					if(err) return callback (err);
					oppDefAct = oppDEF;
					callback();
				});
			},

			function(callback) {
				Player.aggregate([{
					$match: {$and: [
						{isOwned: user.id},{active: 1}]},
					},{
						$group: { _id: "$isOwned",
						total: {
							$sum: "$weekPts"
						}
					}
				}],
				function (err,result){
					if (err) return callback(err);
					console.log(result);
					userPoints = result[0].total;
					callback();
				});
			},

			function(callback) {
				Player.aggregate([{
					$match: {$and: [
						{isOwned: oppID},{active: 1}]},
					},{
						$group: { _id: "$isOwned",
						total: {
							$sum: "$weekPts"
						}
					}
				}],
				function (err,result){
					if (err) return callback(err);
					oppPoints = result[0].total;
					callback();
				});
			},

		], function (err) {
			if (err) return next (err);
			res.render('matchup.handlebars', {username: req.user.username, actQB: qbAct , actRB: rbAct, actWR: wrAct, actTE: teAct, actK: kAct, actDEF: defAct,
				opp : oppName.username, oppQB: oppQbAct, oppRB : oppRbAct, oppWR : oppWrAct, oppTE: oppTeAct, oppK : oppKAct, oppDEF: oppDefAct, 
				uPoints : userPoints, oPoints : oppPoints});
		});	// async.parallel

	});	// User.find
});	// Page route

/*
	Given the current logged-in user and a list of all users,
	return the ID for the user's opponent for the current week.
*/
function getOpponent(user, users) {
	// We don't allow byes, so assume users.length is always even.
	// For each week, reorder users (round robin) until loop reaches current week.
	for (var week = 1; week < currWeek; week++) {
		var lastE = users.pop();  // Remove last element, store in lastE
		users.splice(1, 0, lastE);  // Insert last element into position 1, creates new order
	}	
	// Iterate through each matchup in current order, find user's match for the week
	for (var i = 0; i < (users.length/2); i++) {
		var userA = users[i];
		var userB = users[users.length-1-i];
		if (userA.id == user.id) {
			return userB.id;
		}
		if (userB.id == user.id) {
			return userA.id;
		}
	}
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