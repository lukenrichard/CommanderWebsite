const express = require("express");
const session = require('express-session');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var passportConfig = require('./js/passport.js');
var flash = require('connect-flash');
const app = express();

app.use(flash());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("js"));
app.use(express.static("dist"));
app.use(express.static("pictures"));
app.use(express.static(__dirname));

// Configure passport with functions and strategies listed in the passport.js file.

passportConfig(passport);

// Use Express session to ensure User remains in server as long as he is logged in by Passport.

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport.

app.use(passport.initialize());

// Link Passport with the Express session to ensure User information is stored in back end.

app.use(passport.session());

// Connect to MySQL database.

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pass9word3",
  database: "testdb"
});

con.connect(function(err) {
  if (err){
    throw err;
  } 
  console.log("Connected!");
});

// Whenever a GET request is sent to the server from the front end, ensure that the local User matches the user stored on the back end.

app.get('*', function(req, res, next) {
  console.log(req.user);
  res.locals.user = req.user || null;
  next();
})

// Whenever a GET request to "/" is sent from the front end, render the Home Page.

app.get("/", function(req, res) {
  res.render("homepage.ejs");
});

// Whenever a GET request to "/user" is sent from the front end, return the User saved on the back end.

app.get('/user', (req, res) => {
  res.send(req.user);
});

// Whenever a POST request to "/cards" is sent from the front end, gather card information and insert card into cards table.

app.post("/cards", function(req, res) {
  var card = req.body;
  var sql = "INSERT INTO cards (user, name, manacost, creaturetype, power, toughness, tcgprice, imageurl, purchaseurl) VALUES ('" + String(req.user.username) + "', '" + String(card.name) + "', '" + String(card.manacost) + "', '" + String(card.creaturetype) + "', '" + String(card.power) + "', '" + String(card.toughness) + "', '" + String(card.tcgprice) + "', '" + String(card.imageurl) + "', '" + String(card.purchaseurl) + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});

// Whenever a POST request to "/accounts" is sent from the front end, send username and passport information to Passport and use local-signup strategy.

app.post("/accounts", passport.authenticate('local-signup'));

// Whenever a POST request to "/login" is sent from the front end, send username and passport information to Passport and use local-login strategy.

app.post("/login", passport.authenticate('local-login', {
    successRedirect:'/cardsearch',
    failureRedirect:'/login'
  })
);

// Whenever a GET request to "/logout" is sent from the front end, logout user through Passport.

app.get('/logout', (req, res) => {
  req.logout();
  return res.json({status: 'success'});
});

// Whenever a GET request to "/cards" is sent from the front end, send all cards contained in the cards table to the front end.

app.get("/cards", function(req, res) {
  con.query("SELECT * FROM cards", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

// Whenever a GET request to "/accounts" is sent from the front end, send all accounts contained in the accounts table to the front end.

app.get("/accounts", function(req, res) {
  con.query("SELECT * FROM accounts", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

// Whenever a DELETE request to "/cards" is sent from the front end, obtain card information and search for that card within the cards table. Once found, remove that card from 
// the table.

app.delete("/cards", function(req, res) {
  con.query("DELETE FROM cards WHERE name = '" + String(req.body.name) + "'", function (err, result, fields) {
    if (err) throw err;
    console.log("Card Deleted");
  });
});

// Whenever a GET request to "/commander" is sent from the front end, render the Commander Button Page.

app.get("/commander", function(req, res) {
  res.render("commanderpagereact.ejs");
});

// Whenever a GET request to "/cardsearch" is sent from the front end, render the Card Search Page.

app.get("/cardsearch", function(req, res) {
  res.render("cardsearch.ejs");
});

// Whenever a GET request to "/advancedsearch" is sent from the front end, render the Advanced Card Search Page.

app.get("/advancedsearch", function(req, res) {
  res.render("advancedsearch.ejs");
});

// Whenever a GET request to "/decklist" is sent from the front end, render the Deck List Page.

app.get("/decklist", function(req, res) {
  res.render("decklist.ejs");
});

// Whenever a GET request to "/loginpage" is sent from the front end, render the Login Page.

app.get("/loginpage", function(req, res) {
  res.render("login.ejs");
});

// Set up server to listen on PORT 3000.

app.listen("3000", function() {
  console.log("Website online.");
});
