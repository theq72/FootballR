var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	id: String,
	esbid: String,
	gsisPlayerId: String,
	name: String,
	position: String,
	teamAbbr: String,
	stats:{
		"1": Number
	},
	seasonPts: Number,
	seasonProjectedPts: Number,
	weekPts: Number,
	weekProjectedPts: Number,
	isOwned: String,
	week: Number,
	active: Number
});

module.exports = mongoose.model('Player', schema);