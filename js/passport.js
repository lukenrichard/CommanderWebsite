var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');

var con = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'pass9word3',
    database: 'testdb'
});

/*
var con = mysql.createConnection({
    host: "localhost",
    user: "luke",
    password: "pass9word3",
    database: "DB"
  }); */

  module.exports = function(passport) {
      passport.serializeUser(function(username, done) {
          done(null, username);
      });

      passport.deserializeUser(function(username, done) {
          con.query("SELECT * from accounts where username = '" + username + "'", function(err, rows) {
              done(err, username);
          });
      });
  }

  passport.use('local-signup', new LocalStrategy({
      username: 'username',
      password: 'password',
      passReqToCallback: true
  },
  function(req, username, password, done) {
      con.query("SELECT * FROM accounts WHERE username = '" + username + "'", function(err, rows) {
          if (err) {
              return done(err);
          }
          if (rows.length) {
              return done(null, false, {message:'Username is already taken.' });
          }
          else {
              var newUser = new Object();
              newUser.username = username;
              newUser.password = password;
              var sql = "INSERT INTO accounts (username, password) VALUES ('" + String(username) + "', '" + String(password) + "')";
              con.query(sql, function(err, rows) {
                console.log("User inserted.")
                return done(null, newUser);
              });
          }
      });
  }));
  passport.use('local-login', new LocalStrategy({
      username: 'username',
      password: 'password',
      passReqToCallback: true
  },
  function(req, username, password, done) {
      con.query("SELECT * FROM accounts WHERE username = '" + req.body.username + "'", function(err, rows) {
          if (!rows.length) {
              console.log("No user.")
              return done(null, false, {message:'No user found.' });
          }
          if (!(rows[0].password == password)) {
              console.log("Wrong pass.")
              return done(null, false, {message:'Wrong password.' });
          }
          console.log("Logged in.")
          var User = new Object();
          User.username = rows[0].username;
          User.password = rows[0].password;
          return done(null, User);
      });
  }));