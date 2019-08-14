var express = require('express');
var router = express.Router();
var passport = require('passport');
var async = require('async');

var Player = require('../models/player');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res)
{

	// Find all unowned Players in MongoDB
	Player.find({
		$and : [
		{isOwned: "N/A"},
		{seasonProjectedPts: {$gt:0}}
		]})

	// Sort and display in descending order on players page
	.sort([['seasonProjectedPts', 'descending']])

	.exec(function (err, player) 
	{

	// Render the webpage with players passed over.
	res.render('players.handlebars', {players: player});

	});

});

router.get('/getQB', ensureAuthenticated, function(req, res)
{

	// Find all unowned Players in MongoDB
	Player.find({
		$and: [
		{isOwned: "N/A"},
		{position: "QB"},
		{seasonProjectedPts: {$gt:0}}		
		]})

	// Sort and display in descending order on players page
	.sort([['seasonProjectedPts', 'descending']])

	.exec(function (err, player) 
	{

	// Render the webpage with players passed over.
	res.render('players.handlebars', {players: player});

	});

});

router.get('/getRB', ensureAuthenticated, function(req, res)
{

	// Find all unowned Players in MongoDB
	Player.find({
		$and: [
		{isOwned: "N/A"},
		{position: "RB"},
		{seasonProjectedPts: {$gt:0}}		
		]})

	// Sort and display in descending order on players page
	.sort([['seasonProjectedPts', 'descending']])

	.exec(function (err, player) 
	{

	// Render the webpage with players passed over.
	res.render('players.handlebars', {players: player});

	});

});

router.get('/getWR', ensureAuthenticated, function(req, res)
{

	// Find all unowned Players in MongoDB
	Player.find({
		$and: [
		{isOwned: "N/A"},
		{position: "WR"},
		{seasonProjectedPts: {$gt:0}}		
		]})

	// Sort and display in descending order on players page
	.sort([['seasonProjectedPts', 'descending']])

	.exec(function (err, player) 
	{

	// Render the webpage with players passed over.
	res.render('players.handlebars', {players: player});

	});

});

router.get('/getTE', ensureAuthenticated, function(req, res)
{

	// Find all unowned Players in MongoDB
	Player.find({
		$and: [
		{isOwned: "N/A"},
		{position: "TE"},
		{seasonProjectedPts: {$gt:0}}		
		]})

	// Sort and display in descending order on players page
	.sort([['seasonProjectedPts', 'descending']])

	.exec(function (err, player) 
	{

	// Render the webpage with players passed over.
	res.render('players.handlebars', {players: player});

	});

});

router.get('/getDEF', ensureAuthenticated, function(req, res)
{

	// Find all unowned Players in MongoDB
	Player.find({
		$and: [
		{isOwned: "N/A"},
		{position: "DEF"},
		{seasonProjectedPts: {$gt:0}}		
		]})

	// Sort and display in descending order on players page
	.sort([['seasonProjectedPts', 'descending']])

	.exec(function (err, player) 
	{

	// Render the webpage with players passed over.
	res.render('players.handlebars', {players: player});

	});

});

router.get('/getK', ensureAuthenticated, function(req, res)
{

	// Find all unowned Players in MongoDB
	Player.find({
		$and: [
		{isOwned: "N/A"},
		{position: "K"},
		{seasonProjectedPts: {$gt:0}}		
		]})

	// Sort and display in descending order on players page
	.sort([['seasonProjectedPts', 'descending']])

	.exec(function (err, player) 
	{

	// Render the webpage with players passed over.
	res.render('players.handlebars', {players: player});

	});

});

// add player function
router.get('/select-player/:id', function(req,res,next){
	//get player id from request 
	var playerId = req.params.id;
	// user = the logged on user
	var user = req.user;
	
	var playerCount = Player.countDocuments({isOwned: user._id}, function(err,count){
		if (count>15){
			req.flash('error_msg', "Must drop a player");
			res.redirect('/players');
		}
		else {

		// find player and set isOwned to the users ID
		Player.findOneAndUpdate( 
		{id: playerId}, 
		{$set: {isOwned: user._id}}, 
		{new: true}).exec()

		res.redirect('/players');
		}
	});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;