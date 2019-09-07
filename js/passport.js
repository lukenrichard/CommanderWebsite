// This file initializes the Passport middlewear with the correct settings to be calbrated correctly for this Website.

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');

// Connect to mySQL server.

var con = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'pass9word3',
    database: 'testdb'
});

  // Allow serializeUser and deserializeUser functions to be accessible from outside this file.

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

  // Initializes local-signup strategy within Passport.

  passport.use('local-signup', new LocalStrategy({

      // Obtains username and password entered from Login page.

      username: 'username',
      password: 'password',
      passReqToCallback: true
  },
  function(req, username, password, done) {

      // Search through accounts table in MySQL for the username entered.

      con.query("SELECT * FROM accounts WHERE username = '" + username + "'", function(err, rows) {
          if (err) {
              return done(err);
          }

          // If the resulting rows from the MySQL query is not empty, the username has been taken and display that to User.

          if (rows.length) {
              return done(null, false, {message:'Username is already taken.' });
          }
          else {

              // Otherwise, create new User object with username and password and enter information into the accounts table.

              var newUser = new Object();
              newUser.username = username;
              newUser.password = password;
              var sql = "INSERT INTO accounts (username, password) VALUES ('" + String(username) + "', '" + String(password) + "')";

              // Return successful signup to Passport.

              con.query(sql, function(err, rows) {
                console.log("User inserted.")
                return done(null, newUser);
              });
          }
      });
  }));

  // Initializes local-login strategy within Passport.

  passport.use('local-login', new LocalStrategy({

      // Obtains username and password entered from Login page.

      username: 'username',
      password: 'password',
      passReqToCallback: true
  },
  function(req, username, password, done) {

      // Search through accounts table for username entered in the login page.

      con.query("SELECT * FROM accounts WHERE username = '" + req.body.username + "'", function(err, rows) {

          // If the resulting rows from the MySQL query is empty, no users have that username and give error.

          if (!rows.length) {
              console.log("No user.")
              return done(null, false, {message:'No user found.' });
          }

          // If the password inside of the accounts table does not match the username that it is linked with, give error for wrong password.

          if (!(rows[0].password == password)) {
              console.log("Wrong pass.")
              return done(null, false, {message:'Wrong password.' });
          }

          // Set current user with username and password and return successful login and User to Passport.

          console.log("Logged in.")
          var User = new Object();
          User.username = rows[0].username;
          User.password = rows[0].password;
          return done(null, User);
      });
  }));