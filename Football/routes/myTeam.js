var express = require('express');
var router = express.Router();
var async = require('async');

var Player = require('../models/player');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	// Designates the current user
	var user = req.user;

	async.parallel ([

		// Finds all players who are owned by the current user

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
			{isOwned: user.id},{active: 0}, {position: "QB"}]},
			function(err,benchQB) {
				if(err) return callback (err);
				qbBench = benchQB;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: user.id},{active: 0}, {position: "RB"}]},
			function(err,benchRB) {
				if(err) return callback (err);
				rbBench = benchRB;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: user.id},{active: 0}, {position: "WR"}]},
			function(err,benchWR) {
				if(err) return callback (err);
				wrBench = benchWR;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: user.id},{active: 0}, {position: "TE"}]},
			function(err,benchTE) {
				if(err) return callback (err);
				teBench = benchTE;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: user.id},{active: 0}, {position: "TE"}]},
			function(err,benchTE) {
				if(err) return callback (err);
				teBench = benchTE;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: user.id},{active: 0}, {position: "K"}]},
			function(err,benchK) {
				if(err) return callback (err);
				kBench = benchK;
				callback();
			});
			},

		function(callback) {
		Player.find({ $and: [
			{isOwned: user.id},{active: 0}, {position: "DEF"}]},
			function(err,benchDEF) {
				if(err) return callback (err);
				defBench = benchDEF;
				callback();
			});
			}


	], function (err) {
		if (err) return next (err);
		res.render('myTeam.handlebars', {username: req.user.username, actQB: qbAct , actRB: rbAct, actWR: wrAct, actTE: teAct, actK: kAct, actDEF: defAct,
			resQB : qbBench, resRB: rbBench, resWR: wrBench, resTE: teBench, resK: kBench, resDEF: defBench });
		});

});

// add player function
router.get('/drop-player/:id', function(req,res,next){
	//get player id from request 
	var playerId = req.params.id;
	// user = the logged on user
	var user = req.user;

	// find player and set isOwned to the users ID
	Player.findOneAndUpdate( 
	{id: playerId}, 
	{$set: {isOwned: "N/A", active: 0}}, 
	{new: true}).exec()

	res.redirect('/myTeam');
});

// Set Player to Active
router.get('/set-act/:id/QB', function(req,res,next){
	// Save Player ID
	var playerId = req.params.id;
	// Save Player Position
	var playerPos= req.params.pos;
	// Save user
	var user = req.user;

	if (playerPos = "QB"){
		qbCount = Player.countDocuments({ $and: [
	 	{isOwned: user.id},{active:1},{position: "QB"}]},
	 	function(err,count){
	 		qbCount = count;
	 		if (qbCount>0){
	 			req.flash('error_msg', "Must bench a QB");
				res.redirect('/myTeam');
	 		}
	 		else{
	 			Player.findOneAndUpdate(
					{id: playerId},
					{$set: {active: 1}},
					{new: true}).exec()

					res.redirect('/myTeam');
	 		}
		});
	}
});

router.get('/set-act/:id/RB', function(req,res,next){
	// Save Player ID
	var playerId = req.params.id;
	// Save Player Position
	var playerPos= req.params.pos;
	// Save user
	var user = req.user;

	if (playerPos = "RB"){
		rbCount = Player.countDocuments({ $and: [
	 	{isOwned: user.id},{active:1},{position: "RB"}]},
	 	function(err,count){
	 		rbCount = count;
	 		if (rbCount>1){
	 			req.flash('error_msg', "Must bench a RB");
				res.redirect('/myTeam');
	 		}
	 		else{
	 			Player.findOneAndUpdate(
					{id: playerId},
					{$set: {active: 1}},
					{new: true}).exec()

					res.redirect('/myTeam');
	 		}
		});
	}
});

router.get('/set-act/:id/WR', function(req,res,next){
	// Save Player ID
	var playerId = req.params.id;
	// Save Player Position
	var playerPos= req.params.pos;
	// Save user
	var user = req.user;

	if (playerPos = "WR"){
		wrCount = Player.countDocuments({ $and: [
	 	{isOwned: user.id},{active:1},{position: "WR"}]},
	 	function(err,count){
	 		wrCount = count;
	 		if (wrCount>2){
	 			req.flash('error_msg', "Must bench a WR");
				res.redirect('/myTeam');
	 		}
	 		else{
	 			Player.findOneAndUpdate(
					{id: playerId},
					{$set: {active: 1}},
					{new: true}).exec()

					res.redirect('/myTeam');
	 		}
		});
	}
});

router.get('/set-act/:id/TE', function(req,res,next){
	// Save Player ID
	var playerId = req.params.id;
	// Save Player Position
	var playerPos= req.params.pos;
	// Save user
	var user = req.user;

	if (playerPos = "TE"){
		teCount = Player.countDocuments({ $and: [
	 	{isOwned: user.id},{active:1},{position: "TE"}]},
	 	function(err,count){
	 		teCount = count;
	 		if (teCount>0){
	 			req.flash('error_msg', "Must bench a TE");
				res.redirect('/myTeam');
	 		}
	 		else{
	 			Player.findOneAndUpdate(
					{id: playerId},
					{$set: {active: 1}},
					{new: true}).exec()

					res.redirect('/myTeam');
	 		}
		});
	}
});

router.get('/set-act/:id/K', function(req,res,next){
	// Save Player ID
	var playerId = req.params.id;
	// Save Player Position
	var playerPos= req.params.pos;
	// Save user
	var user = req.user;

	if (playerPos = "K"){
		kCount = Player.countDocuments({ $and: [
	 	{isOwned: user.id},{active:1},{position: "K"}]},
	 	function(err,count){
	 		kCount = count;
	 		if (kCount>0){
	 			req.flash('error_msg', "Must bench a K");
				res.redirect('/myTeam');
	 		}
	 		else{
	 			Player.findOneAndUpdate(
					{id: playerId},
					{$set: {active: 1}},
					{new: true}).exec()

					res.redirect('/myTeam');
	 		}
		});
	}
});

router.get('/set-act/:id/DEF', function(req,res,next){
	// Save Player ID
	var playerId = req.params.id;
	// Save Player Position
	var playerPos= req.params.pos;
	// Save user
	var user = req.user;
	if (playerPos = "DEF") {
		defCount = Player.countDocuments({ $and: [
	 	{isOwned: user.id},{active:1},{position: "DEF"}]},
	 	function(err,count){
	 		defCount = count;
	 		if (defCount>0){
	 			req.flash('error_msg', "Must bench a DEF");
				res.redirect('/myTeam');
	 		}
	 		else{
	 			Player.findOneAndUpdate(
					{id: playerId},
					{$set: {active: 1}},
					{new: true}).exec()

					res.redirect('/myTeam');
	 		}
		});
	}
});

router.get('/set-inAct/:id', function(req,res,next){
	var playerId = req.params.id;
	// Set Player to Active

	Player.findOneAndUpdate(
		{id: playerId},
		{$set: {active: 0}},
		{new: true}).exec()

		res.redirect('/myTeam');
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