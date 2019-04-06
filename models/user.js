const mongoose = require('mongoose');


const bcrypt = require('../node_modules/bcryptjs')


const UserSchema = new mongoose.Schema({ 
	username: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	password: {
		type: String,
		required: true,
		minlength: [8 , 'Password has to be atleast 8 characters'],
		trim: true
	},
	isAdmin: {
		type: Number,
		default: false,
	}
});


UserSchema.pre('save', function(next) {
	const user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}

});

const User = mongoose.model('User', UserSchema);

module.exports = { 
	User 
};
