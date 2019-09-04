const express = require("express");
const session = require('express-session');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var passportConfig = require('./js/passport.js');
var flash = require('connect-flash');
const app = express();

const accountSid = "AC675b825fa2a903e04ed81910f1ae5324";
const authToken = "87e14e3ceba6b1894c9100bc23940b8a";
const client = require("twilio")(accountSid, authToken);

app.use(flash());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("js"));
app.use(express.static("dist"));
app.use(express.static("pictures"));
app.use(express.static(__dirname));

passportConfig(passport);

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());

app.use(passport.session());

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

app.get('*', function(req, res, next) {
  console.log(req.user);
  res.locals.user = req.user || null;
  next();
})

app.get("/", function(req, res) {
  res.render("homepage.ejs");
});

app.get('/user', (req, res) => {
  res.send(req.user);
});

app.post("/cards", function(req, res) {
  var card = req.body;
  console.log(req.user);
  var sql = "INSERT INTO cards (user, name, manacost, creaturetype, power, toughness, tcgprice, imageurl, purchaseurl) VALUES ('" + String(req.user.username) + "', '" + String(card.name) + "', '" + String(card.manacost) + "', '" + String(card.creaturetype) + "', '" + String(card.power) + "', '" + String(card.toughness) + "', '" + String(card.tcgprice) + "', '" + String(card.imageurl) + "', '" + String(card.purchaseurl) + "')";
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});

app.post("/accounts", passport.authenticate('local-signup'));

app.post("/login", passport.authenticate('local-login', {
    successRedirect:'/cardsearch',
    failureRedirect:'/login'
  })
);

app.get('/logout', (req, res) => {
  req.logout();
  return res.json({status: 'success'});
});

app.get("/cards", function(req, res) {
  con.query("SELECT * FROM cards", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.get("/accounts", function(req, res) {
  con.query("SELECT * FROM accounts", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.delete("/cards", function(req, res) {
  console.log(req.body);
  con.query("DELETE FROM cards WHERE name = '" + String(req.body.name) + "'", function (err, result, fields) {
    if (err) throw err;
    console.log("Card Deleted");
  });
});

app.get("/commander", function(req, res) {
  res.render("commanderpagereact.ejs");
});

app.get("/cardsearch", function(req, res) {
  res.render("cardsearch.ejs");
});

app.get("/advancedsearch", function(req, res) {
  res.render("advancedsearch.ejs");
});

app.get("/decklist", function(req, res) {
  res.render("decklist.ejs");
});

app.get("/loginpage", function(req, res) {
  res.render("login.ejs");
});

app.listen("3000", function() {
  console.log("Website online.");
});
