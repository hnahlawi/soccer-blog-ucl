const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({ 
	username: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	match_id: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	date: {
		type: String,
		required: false,
		minlength: 1,
		trim: true
	}
});



const Post = mongoose.model('Post', PostSchema);

module.exports = { 
	Post 
};

