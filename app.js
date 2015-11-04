var config = require('./config');
var credentials = require('./credentials');



var express = require('express');
var app = express();



var session = require('express-session')
app.use(session({
  genid: function(req) {
    return '11111111111111' // use UUIDs for session IDs 
  },
  secret: 'keyboard cat'
}))



var passport = require('passport');
app.use(passport.initialize());



app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    clientID: credentials.CONSUMER_KEY.facebook,
    clientSecret: credentials.CONSUMER_SECRET.facebook,
    callbackURL: config.domain + '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'name', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
    done( null, profile );
  }
));

app.get('/auth/facebook',
  function(req, res, next){
    if( req.query.clientRedirectUrl ){
      req.session.clientRedirectUrl = req.query.clientRedirectUrl;  
    }
    next();
  },
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] }))

app.get('/auth/facebook/callback',
  function(req, res, next){
    next();
  },
  passport.authenticate('facebook', 
    { successRedirect: '/',
      failureRedirect: '/' }));



var TwitterStrategy = require('passport-twitter').Strategy;
passport.use(new TwitterStrategy({
    consumerKey: credentials.CONSUMER_KEY.twitter,
    consumerSecret: credentials.CONSUMER_SECRET.twitter,
    callbackURL: config.domain + '/auth/twitter/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log( profile );
    done( null, profile );
  }
));

app.get('/auth/twitter',
  function(req, res, next){
    if( req.query.clientRedirectUrl ){
      req.session.clientRedirectUrl = req.query.clientRedirectUrl;  
    }
    next();
  },
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  function(req, res, next){
    next();
  },
  passport.authenticate('twitter',  
    { successRedirect: '/',
      failureRedirect: '/' }));


// var GitHubStrategy = require('passport-github2').Strategy;
// passport.use(new GitHubStrategy({
//     clientID: credentials.CONSUMER_KEY.github,
//     clientSecret: credentials.CONSUMER_SECRET.github,
//     callbackURL: config.domain + '/auth/github/callback'
//   },
//   function(accessToken, refreshToken, profile, done) {
//     done( null, profile ); 
//   }
// ));
// app.get('/auth/github', 
//   function(req, res, next){
//     if( req.query.clientRedirectUrl ){
//       req.session.clientRedirectUrl = req.query.clientRedirectUrl;  
//     }
//     next();
//   },
//   passport.authenticate('github'));
// app.get('/auth/github/callback',
//   function(req, res, next){
//     if( req.query.clientRedirectUrl ){
//       req.session.clientRedirectUrl = req.query.clientRedirectUrl;  
//     }
//     next();
//   },
//   passport.authenticate('github',  
//     { successRedirect: '/',
//       failureRedirect: '/' }));




app.get('/', function (req, res) {

  if (req.session.clientRedirectUrl) {
    redirectURL = req.session.clientRedirectUrl;
    delete req.session.clientRedirectUrl;  

    var user = {}
    if( req.user.provider == 'facebook' ){
      user.provider = 'facebook';
      user.id = req.user.id || 'None';
      user.firstName = req.user.name.givenName || 'None';
      user.lastName = req.user.name.familyName || 'None';
      user.email = req.user.emails[0].value || 'None';
    }else if( req.user.provider == 'twitter' ){
      user.provider = 'twitter';
      user.id = req.user.id || 'None';
      user.firstName = req.user.displayName.split(' ')[0] || 'None';
      user.lastName = req.user.displayName.split(' ')[1] || 'None';
      user.email = 'None';
    }

    if( user ){
      res.redirect( redirectURL + 
        '?provider=' + user.provider + 
        '&id=' + user.id + 
        '&firstName=' + user.firstName + 
        '&lastName=' + user.lastName + 
        '&email=' + user.email );  
    }else{
      res.send('Hello World!');  
    }
  }else{
    res.send('Hello World!');
  } 
});



var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});