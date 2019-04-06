const log = console.log

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const path = require('path')
const bcrypt = require('bcryptjs')

const { User } = require('./models/user.js')


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




const sessionChecker = (req, res, next) => {
	if (req.session.user) {
		console.log('here')
        res.redirect('/dashboard');
	} else {
		next();
	}
};


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
app.get('/', sessionChecker, (req, res) => {
	console.log('this is the session user', req.session.user)
	res.redirect('/dashboard')
})



app.get('/dashboard', (req, res) =>{
    if (req.session.user){
        res.sendFile(__dirname + '/home.html')
    }else{

        res.redirect('/')

    }

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
            	console.log('saved user')
                req.session.user = user._id;
                req.session.email = user.username;
                res.sendFile(path.join(__dirname, "/home.html"));
            }).catch((error) => {
                //res.sendFile(path.join(__dirname, "/public/pages/index.html"));
                console.log('error')
                res.send(error.message);
            }); 
        }else{
        	console.log('redirecting back to home')
            res.redirect('/');
        }
})

})


app.post('/login', sessionChecker, (req, res) => {
    //log(req.body.isAdmin);
    const username = req.body.username;
    const password = req.body.password;
    console.log('username we got is', username)
    console.log('password we got is', password)
    User.findOne({"username": username}).then((user)=>{
        if(!user){
            res.send('user does not exist');
        }else{
        	bcrypt.compare(password, user.password, (error, result) => {
                if(error){
                    res.send('wrong credentials')
             }

            if (result == true){
            req.session.user = user._id;
            req.session.username = user.username;
            //res.send(user);
            console.log(req.session.username)
            res.sendFile(path.join(__dirname, "/home.html"));
 			 }
 			 else{
 			 	res.send('wrong credentials')
 			 }
           })
        }
    }).catch((error) => {
        res.send('some error');
    });
});



app.get('/signOut', (req, res) =>{
    req.session.destroy((error) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.redirect('/');
        }
    });  

})


app.delete('/user/:id', (req, res)=>{

    User.findOneAndRemove({_id: new ObjectID(req.params.id)}, (err, res) => {
        if(err){
            res.send('Error occured, cannot delete');
        }else{

            res.send('deleted user: ', req.params.id)
        }
    });


})






app.listen(port, () => {
	log(`Listening on port ${port}...`)
});