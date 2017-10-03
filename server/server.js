require('dotenv').config();
//const spotifyPlayer = new SpotifyPlayer();

const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express'),
    request = require('request'),
    massive = require('massive'),
    session = require('express-session'),
    passport = require('passport'),
    querystring = require('querystring'),
    cookieParser = require('cookie-parser'),
    SpotifyStrategy = require('passport-spotify').Strategy;

var appKey = '550047c75a534eb3a2cb10128abc03c4';
var appSecret = 'e2297a9787d1445a8dbfc1630f078c3f';
var stateKey = 'spotify_auth_state';

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
//==========Spotify-Web-Api-Node====================================

// var spotifyApi = new SpotifyWebApi({
//     clientId : appKey,
//     clientSecret : appSecret,
//     redirectUri : "http://localhost:3030/auth/spotify/callback"
//   });

//   spotifyApi.setAccessToken('BQA0UGp0pB9rGoBEjtQ7Gya1wwAIzhrwkQPYOxalgqqTD4RTpuKrJBwoCLas7tArH7o0n_2mVMdXVYri7Ir-2TlkEUxOPt6hPakq-zSm4jsnovrRPTSVzHPulLRMmiyC8dXb_BBotZr7dFJIPvVe3_J4QY2I4z9LI88&refresh_token=AQBWyGkBXh2wb3uQ-s4l9lmI9LJfNmH_Szf-rJdNiIJqe8Ru0FhYZGThLPDtLdLAMM-jmrC3datwVqKvXPX0P786K99YgOv1OF8wo1QysxdXa2TdwwdAdcIUCBuQbGvipHs')

//   spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
//   .then(function(data) {
//     console.log('Artist albums', data.body);
//   }, function(err) {
//     console.error(err);
//   });
//==================================================================



const app = express();

// app.use(express.static(__dirname + '/public'))
// .use(cookieParser());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

massive(process.env.CONNECTION_STRING)
    .then( db => {
        app.set('db', db);
    })
// try putting this inside massive, so they are run together
passport.use(new SpotifyStrategy({
    clientID: appKey,
    clientSecret: appSecret,
    callbackURL: "http://localhost:3030/auth/spotify/callback"
  }, function(accessToken, refreshToken, profile, done) { 
        const db = app.get('db');
      db.get_user([profile.id + '']).then (user => {
         if (user[0]) {
            user[0].accessToken = accessToken;
            user[0].refreshToken = refreshToken;
            //creating a property on the user in the db (new object)
            done(null, user[0])
        } else {
            db.create_user([profile.displayName, profile.emails[0].value, 
             profile.id]).then (user => {
                 user[0].accessToken = accessToken;
                user[0].refreshToken = refreshToken;
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

passport.serializeUser(function(user, done) {
    //console.log('in serial', user)
    done(null, user);
})

passport.deserializeUser(function(user, done) {
    app.get('db').current_user(user.id).then (user => {
        //console.log('in deserial', user)
        done(null, user);
    })
})

app.get('/auth/spotify', 
    passport.authenticate('spotify', 
    {scope: ['user-read-email', 'user-read-private'], showDialog: true}
    ), 
    function(req, res) {
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


app.get('')


app.get('/auth/logout', (req, res) => {
    //console.log('in auth/logout, called')
    req.session.destroy();
    res.redirect(302, 'http://localhost:3000/')
})

const PORT = 3030;
app.listen(PORT, () => console.log('listening on port: ', PORT))

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }
 
