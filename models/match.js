const mongoose = require('mongoose');


const MatchSchema = new mongoose.Schema({ 
	home: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	away: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	round: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	date: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});



const Match = mongoose.model('Match', MatchSchema);

module.exports = { 
	Match 
};

