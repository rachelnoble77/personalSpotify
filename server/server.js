require('dotenv').config();
const express = require('express'),
    //bodyParser = require('body-parser'),
    //cookieParser = require('cookie-parser'),
    //methodOverride = require('method-override'),
    massive = require('massive'),
    session = require('express-session'),
    passport = require('passport'),
    //swig = require('swig'),
    SpotifyStrategy = require('passport-spotify').Strategy;
    Auth0Strategy = require('passport-auth0');
//var consolidate = require('consolidate');

var appKey = '550047c75a534eb3a2cb10128abc03c4';
var appSecret = 'e2297a9787d1445a8dbfc1630f078c3f';

const app = express();

// app.set('view', __dirname + '/views');
// app.set('view engine', 'ejs');

//app.use(cookieParser());
//app.use(bodyParser());
//app.use(methodOverride());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

//app.use(express.static(__dirname + '/public'));

//app.engine('html', consolidate.swig);

// app.get('/', function(req, res) {
//     console.log()
//     res.render('index.html', { user: req.user });
// });

// app.get('/account', ensureAuthenticated, function(req,res) {
//     console.log('account')
//     res.render('account.html', { user: req.user });
// });

// app.get('./login', function(req, res) {
//     console.log('inside login')
//     res.render('login.html', { user: req.user });
// });

massive(process.env.CONNECTION_STRING)
    .then( db => {
        app.set('db', db);
    })

passport.use(new SpotifyStrategy({
    clientID: appKey,
    clientSecret: appSecret,
    callbackURL: "http://localhost:3030/auth/spotify/callback"
  },
    function(accessToken, refreshToken, profile, done) {

        const db = app.get('db');
        
            db.get_user([profile.id + '']).then (user => {
                if (user[0]) {
                    done(null, user[0])
                } else {
                    db.create_user([profile.displayName, profile.emails[0].value, 
                    profile.id]).then (user => {
                        done(null, user[0])
                    })
                }
            })

        // User.findOrCreate({ spotifyId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
        process.nextTick(function() {
            return done(null, profile);
        });
    }));

// passport.use( new Auth0Strategy({
//     domain: process.env.AUTH_DOMAIN,
//     clientID: process.env.AUTH_CLIENT_ID,
//     clientSecret: process.env.AUTH_CLIENT_SECRET,
//     callbackURL: process.env.AUTH_CALLBACK
// }, function(accessToken, refreshToken, extraParams, profile, done) {
//     const db = app.get('db');

//     db.get_user([profile.identities[0].user_id + '']).then (user => {
//         if (user[0]) {
//             done(null, user[0])
//         } else {
//             db.create_user([profile.displayName, profile.emails[0].value, 
//             profile.identities[0].user_id]).then (user => {
//                 done(null, user[0])
//             })
//         }
//     })
// }))

passport.serializeUser(function(user, done) {
    done(null, user);
})

passport.deserializeUser(function(user, done) {
    app.get('db').current_user(user.id).then (user => {
        done(null, user);
    })
})

// app.get('/auth', passport.authenticate('auth0'));

// app.get('/auth/callback', passport.authenticate('auth0', {
//     successRedirect: 'http://localhost:3000/#/private',
//     failureRedirect: '/auth'
// }))

app.get('/auth/spotify', 
    passport.authenticate('spotify', 
    {scope: ['user-read-email', 'user-read-private'], showDialog: true}
    ), 
    function(req, res) {
        // hopefully redirected to spotify for authentication, so not actually called...
    });

app.get('/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('http://localhost:3000/#/private');
    });

app.get('/auth/user', (req, res, next) => {
    if (!req.user) {
        res.sendStatus(404);
    } else {
       res.status(200).send(req.user)
    }
})

app.get('/auth/logout', (req, res) => {
    req.logOut();
    res.redirect(302, 'http://localhost:3000/')
})

// app.get('/auth/logout', (req, res) => {
//     req.destroy(() => {
//         res.redirect('http://localhost:3000/');
//     });
// });

const PORT = 3030;
app.listen(PORT, () => console.log('listening on port: ', PORT))

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }