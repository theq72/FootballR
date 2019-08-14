var express = require('express');
var router = express.Router();
var passport = require('passport');

var Player = require('../models/player');

var User = require('../models/user');


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index.handlebars', {username: req.user.username, 
    	email: req.user.email,
    	name: req.user.name});
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