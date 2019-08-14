var express = require('express');
var router = express.Router();
var async = require('async');

var Player = require('../models/player');
var User = require('../models/user');

// Get Homepage
router.get('/:id', ensureAuthenticated, function(req, res){
	// Designates the clicked user 
	var userId = req.params.id;

	async.parallel ([


		function(callback) {
		User.findOne({_id : userId}, 
			function (err, user){
				if (err) return callback(err);
				userName = user;
				callback();
			});
		},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 1}, {position: "QB"}]},
			function(err,actQB) {
				if(err) return callback (err);
				qbAct = actQB;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 1}, {position: "RB"}]},
			function(err,actRB) {
				if(err) return callback (err);
				rbAct = actRB;
				callback();
			});
			},


		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 1}, {position: "WR"}]},
			function(err,actWR) {
				if(err) return callback (err);
				wrAct = actWR;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 1}, {position: "TE"}]},
			function(err,actTE) {
				if(err) return callback (err);
				teAct = actTE;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 1}, {position: "K"}]},
			function(err,actK) {
				if(err) return callback (err);
				kAct = actK;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 1}, {position: "DEF"}]},
			function(err,actDEF) {
				if(err) return callback (err);
				defAct = actDEF;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 0}, {position: "QB"}]},
			function(err,benchQB) {
				if(err) return callback (err);
				qbBench = benchQB;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 0}, {position: "RB"}]},
			function(err,benchRB) {
				if(err) return callback (err);
				rbBench = benchRB;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 0}, {position: "WR"}]},
			function(err,benchWR) {
				if(err) return callback (err);
				wrBench = benchWR;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 0}, {position: "TE"}]},
			function(err,benchTE) {
				if(err) return callback (err);
				teBench = benchTE;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 0}, {position: "TE"}]},
			function(err,benchTE) {
				if(err) return callback (err);
				teBench = benchTE;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 0}, {position: "K"}]},
			function(err,benchK) {
				if(err) return callback (err);
				kBench = benchK;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: userId},{active: 0}, {position: "DEF"}]},
			function(err,benchDEF) {
				if(err) return callback (err);
				defBench = benchDEF;
				callback();
			});
			}


	], function (err) {
		if (err) return next (err);
		res.render('viewTeam.handlebars', {user: userName, actQB: qbAct , actRB: rbAct, actWR: wrAct, actTE: teAct, actK: kAct, actDEF: defAct,
			resQB : qbBench, resRB: rbBench, resWR: wrBench, resTE: teBench, resK: kBench, resDEF: defBench });
		});

});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;