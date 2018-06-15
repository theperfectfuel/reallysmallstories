dotenv = require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

//const config = require('./config');
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;
const AUTH_SECRET = process.env.AUTH_SECRET;

const Post = require('./models/post');

const blogRouter = require('./routes/blog');
const User = require('./models/user');

mongoose.Promise = global.Promise;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('common'));
app.use(express.static('views'));
app.use(methodOverride('_method'));

app.use(require('express-session')({
    secret: AUTH_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('.hbs', hbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

app.use('/blog', blogRouter);

// ROUTES
app.get('/', (req, res, next) => {
    Post.findOne().sort({created: -1})
        .then(post => {
            let renderedPost = post.serialize();
            res.render('root', {post: renderedPost, user: req.user});
        });
});

app.get('/new-post', isLoggedIn, (req, res, next) => {
    res.render('new-post', {user: req.user});
});

// AUTH ROUTES
app.get('/register', (req, res, next) => {
    res.render('register', {user: req.user});
})

app.post('/register', (req, res, next) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let username = req.body.username;
    let password = req.body.password;

    let user = new User({
        username: username,
        firstName: firstName,
        lastName: lastName
    });

    User.register(user, password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register', {user: req.user});
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/blog');
        });
    });
})

// LOGIN ROUTES
// render login form
app.get('/login', (req, res, next) => {
    res.render('login', {user: req.user});
})

app.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
})

app.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/blog',
        failureRedirect: '/login'
    }) ,(req, res, next) => {
})

app.get('*', (req, res, next) => {
    res.render('root', {user: req.user});
});

// MIDDLEWARE FOR AUTH
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

let server;

function runServer(DB_URL, PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(PORT, () => {
                console.log(`app listening on port: ${PORT}`);
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log(`closing server`);
                server.close(err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });
}

if (require.main === module) {
    console.log(DB_URL, PORT);
    runServer(DB_URL, PORT).catch(err => {
        console.error(err);
    });
}

module.exports = {app, runServer, closeServer};
