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


var LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
passport.use(new LinkedinStrategy({
    clientID: credentials.CONSUMER_KEY.linkedin,
    clientSecret: credentials.CONSUMER_SECRET.linkedin,
    callbackURL: config.domain + '/auth/linkedin/callback',
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'public-profile-url']
  },
  function(accessToken, refreshToken, profile, done) {
    done( null, profile );
  }
));

app.get('/auth/linkedin',
  function(req, res, next){
    if( req.query.clientRedirectUrl ){
      req.session.clientRedirectUrl = req.query.clientRedirectUrl;  
    }
    next();
  },
  passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'],
    state: 'DCEeFWf4waaew5A53sdfKefwe424' }));

app.get('/auth/linkedin/callback',
  function(req, res, next){
    next();
  },
  passport.authenticate('linkedin',  
    { successRedirect: '/',
      failureRedirect: '/' }));



app.get('/', function (req, res) {

  if (req.session.clientRedirectUrl) {
    redirectURL = req.session.clientRedirectUrl;
    delete req.session.clientRedirectUrl;  

    console.log('logged in');
    console.log(req.user);

    var user = {}
    if( req.user.provider == 'facebook' ){
      user.provider = 'facebook';
      user.id = req.user.id || 'None';
      user.firstName = req.user.name.givenName || 'None';
      user.lastName = req.user.name.familyName || 'None';
      user.email = req.user.emails[0].value || 'None';
      user.link = 'None';
    }else if( req.user.provider == 'twitter' ){
      user.provider = 'twitter';
      user.id = req.user.id || 'None';
      user.firstName = req.user.displayName.split(' ')[0] || 'None';
      user.lastName = req.user.displayName.split(' ')[1] || 'None';
      user.email = 'None';
      user.link = 'None';
    }else if( req.user.provider == 'linkedin'){
      user.provider = 'linkedin';
      user.id = req.user.id || 'None';
      user.firstName = req.user.name.givenName;
      user.lastName = req.user.name.familyName;
      user.email = req.user._json.emailAddress || 'None';
      user.link = req.user._json.publicProfileUrl || 'None';
    }

    if( user ){
      res.redirect( redirectURL + 
        '?provider=' + user.provider + 
        '&id=' + user.id + 
        '&firstName=' + user.firstName + 
        '&lastName=' + user.lastName + 
        '&email=' + user.email + 
        '&link=' + user.link );
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