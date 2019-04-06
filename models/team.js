const mongoose = require('mongoose');


const TeamSchema = new mongoose.Schema({ 
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	stadium: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	abbreviation: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});



const Team = mongoose.model('Team', TeamSchema);

module.exports = { 
	Team 
};

