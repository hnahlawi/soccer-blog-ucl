const log = console.log

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const path = require('path')
const bcrypt = require('bcryptjs')

const { User } = require('./models/user.js')

const { Match } = require('./models/match.js')
const { Post } = require('./models/post.js')
const { Team } = require('./models/team.js')

const datetime = require('date-and-time')


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
        res.send({message: '/dashboard', status: "200"});
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
app.get('/', (req, res) => {
	console.log('this is the session user', req.session.user)
	res.redirect('/dashboard')
})



app.get('/dashboard', (req, res) =>{
    console.log(req.session)
    if (req.session.user){
        console.log('in dashboard session detected')
        res.sendFile(__dirname + '/home.html')
    }else{

        res.sendFile(__dirname + '/index.html')

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
                req.session.username = user.username;

                res.send({message: '/dashboard', status: "200"});
            }).catch((error) => {
                //res.sendFile(path.join(__dirname, "/public/pages/index.html"));
                console.log('error')
                res.send({message: 'short', status: "404"});
            }); 
        }else{
        	console.log('redirecting back to home')
            res.send({message: 'exists', status: "404"});
        }
})

})


app.post('/login', sessionChecker, (req, res) => {
    //log(req.body.isAdmin);
    res.set('Content-Type', 'application/json');

    const username = req.body.username;
    const password = req.body.password;
    console.log('username we got is', username)
    console.log('password we got is', password)
    User.findOne({"username": username}).then((user)=>{
        if(!user){
            console.log('in user does not exist case')
            res.send({"message": 'user does not exist', "status": "404"});
        }else{
        	bcrypt.compare(password, user.password, (error, result) => {
                if(error){
                    console.log('in bcrypt error')
                res.send({"message": 'wrong credentials', "status": "404"});
             }

            if (result == true){
            req.session.user = user._id;
            req.session.username = user.username;
            console.log('in success case')

            //res.send(user);
            res.send({"message": '/dashboard', "status": "200"});
 			 }
 			 else{
                console.log('in wrong credentials')
                res.send({"message": 'wrong credentials', "status": "404"});
 			 }
           })
        }
    }).catch((error) => {
        console.log('in error catch')
         res.send({"message": 'error', "status": "404"});
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


/* 
Here are the routes for matches

*/

app.post('/match', (req, res)=>{

    
    const dateObj = datetime.parse(req.body.date, 'DD/MM/YYYY')

    const match = new Match({

        home: req.body.home,
        away: req.body.away,
        round: req.body.round,
        date: dateObj.toISOString(),
        match_string: req.body.match_string

    })

    match.save().then((result)=>{

        console.log('added match')
        res.send(match)
    }).catch((error)=>{

        console.log('could not add match: ', error)
        res.send('could not add match')
    })


})


app.get('/match/:id', (req, res)=>{

    
    Match.findOne({"_id": req.params.id}).then((result)=>{

        if(!result){
            res.send('match does not exist')
        }
        else{

            const response = {
                _id: req.params.id,
                home: result.home,
                away: result.away,
                match_string: result.match_string,
                round: result.round,
                date: datetime.format(new Date(result.date), "dddd MMMM D, YYYY")

            }

            res.send(response)
        }


    })

})

app.get('/matchesByRound/:round', (req, res) =>{

    Match.find({"round": req.params.round}).then((result)=>{

        if(result.length !== 0){

            result.sort(function(a, b) {
                
                return new Date(a.date) - new Date(b.date)
            })


            res.send(result)
        }
        else{

            res.send([])
        }

    })

})



/* 

Routes for teams

*/

app.post('/team', (req, res)=>{
    const team = new Team({

        name: req.body.name,
        stadium: req.body.stadium,
        abbreviation: req.body.abbreviation

    })

    team.save().then((result)=>{

        console.log('added team')
        res.send(team)
    }).catch((error)=>{

        console.log('could not add team: ', error)
        res.send('could not add team')
    })


})


app.get('/team/:id', (req, res)=>{

    
    Team.findOne({"_id": req.params.id}).then((result)=>{

        if(!result){
            res.send('team does not exist')
        }
        else{

            res.send(result)
        }


    })

})


/*

Routes for posts


*/

app.post('/comment', (req, res)=>{
    console.log(req.session.user)
    const post = new Post({

        username: req.session.username,
        match_id: req.body.match_id,
        text: req.body.text,
        date: new Date().toISOString()

    })

    post.save().then((result)=>{

        console.log('added post')
        res.send(post)
    }).catch((error)=>{

        console.log('could not add post: ', error)
        res.send('could not add post')
    })


})


app.get('/comments/:match_id', (req, res)=>{

    Post.find({"match_id": req.params.match_id}).then((result)=>{

        if(!result){
            res.send('No comments on this game')
        }
        else{

            result.sort(function(a, b) {
                
                return new Date(a.date) - new Date(b.date)
            })

            res.send(result)
        }

    })

})



app.get('/currentUserInfo', (req, res)=>{

    const response = {

        user_id: req.session.user,
        username: req.session.username
    }

    res.send(response)

})





app.listen(port, () => {
	log(`Listening on port ${port}...`)
});