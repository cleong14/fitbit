var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();

var oauth2 = require('simple-oauth2')({
  clientID: '227RHW',
  clientSecret: '6aeb0b1e5210e7a11a7a2598e1c177b0',
  site: 'https://fitbit.com/login',
  tokenPath: '/oauth/access_token',
  authorizationPath: '/oauth/authorize'
});

var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/callback',
  scope: 'notifications',
  state: '3(#0/!~'
});

app.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});

app.get('/callback', function (req, res) {
  var code = req.query.code;
 
  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://localhost:3000/callback'
  }, saveToken);
 
  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    token = oauth2.accessToken.create(result);
  }
});

app.get('/', function (req, res) {
  res.send('Hello<br><a href="/auth">Log in with Fitbit</a>');
});


var server = app.listen(3000, function() {
  console.log('Listening to port', server.address().port);
});