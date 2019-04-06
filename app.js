const log = console.log

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const path = require('path')
const bcrypt = require('bcryptjs')



const {
	ObjectID
} = require('mongodb')

// Import our mongoose connection
const {
	mongoose
} = require('./db/mongoose');


const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({
	extended: true
}))


app.use(express.static(path.join(__dirname)));



app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true
	}
}))
// Add middleware to check for logged-in users




app.get('/', (req, res) => {
	console.log(__dirname)
	res.sendFile(__dirname + '/index.html')
})


app.post('/signup', (req, res) =>{

	const user = new User({
		username: req.body.username,
		password: req.body.password
	})


	User.find({username: req.body.username}).then((result) => {
        if(result.length === 0){
            //res.send(result);
            
            user.save().then((result) => {
                req.session.user = user._id;
                req.session.email = user.username;
                res.sendFile(path.join(__dirname, "/home.html"));
            }).catch((error) => {
                //res.sendFile(path.join(__dirname, "/public/pages/index.html"));

                res.send(error.message);
            }); 
        }else{
            res.redirect('/');
        }

})


app.listen(port, () => {
	log(`Listening on port ${port}...`)
});