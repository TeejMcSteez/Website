const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs = require('fs');
const path = require('node:path');

const creds = fs.readFileSync(path.join(__dirname, 'conf', 'client_secret_147879745742-bu54ss6r3kbofqlmgbrpa5flen39m3bt.apps.googleusercontent.com.json'));
const jsonCreds = JSON.parse(creds);

passport.use(new GoogleStrategy({
  clientID: jsonCreds.web.client_id,
  clientSecret: jsonCreds.web.client_secret,
  callbackURL: 'https://teejmcsteez.tech/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Here you can save the profile information to your database if needed
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;