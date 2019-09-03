// test

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

/*
var con = mysql.createConnection({
  host: "localhost",
  user: "luke",
  password: "pass9word3",
  database: "DB"
}); */

con.connect(function(err) {
  if (err){
    throw err;
  } 
  console.log("Connected!"); /*
  var sql = "DROP TABLE cards";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table deleted");
  }); */ /*
  var sql = "CREATE TABLE cards (user VARCHAR(255), name VARCHAR(255), manacost VARCHAR(255), creaturetype VARCHAR(255), power VARCHAR(255), toughness VARCHAR(255), tcgprice VARCHAR(255), imageurl VARCHAR(255), purchaseurl VARCHAR(255))";
  
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  }); 

  var sql = "CREATE TABLE accounts (username VARCHAR(255), password VARCHAR(255))"; 
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  }); */ /*
  con.query("CREATE DATABASE DB", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  }); */
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


/*
app.post("/accounts", function(req, res) {
  var account = req.body;
  var sql = "INSERT INTO accounts (username, password) VALUES ('" + String(account.username) + "', '" + String(account.password) + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
}); */
/*
app.post("/login", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  con.query('SELECT * FROM accounts WHERE username = ?',[username], function (error, results, fields) {
  if (error) {
    console.log("Error occured.");
  }
  else{
    if(results.length > 0){
      if(results[0].password == password){
        console.log("Login successful!");
        res.status(200).send("Login successful!");
      }
      else{
        console.log("Username and password do not match!");
        res.status(401).send({error: "Username and password do not match"});
      }
    }
    else{
      console.log("Username does not exist!");
      res.status(404).send({error: "Username does not exist!"});
    }
  }
  });
});
*/
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

app.get("/textbutton", function(req, res) {
  res.render("button.ejs");
});

app.get("/sendText39583275982375", function(req, res) {
  client.messages
    .create({
      body:
        "BBBBBBBBRRRRRRRRRRRRRRRRRRRRRRRRRRRIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIAAAAN",
      from: "+16196757030",
      to: "+18582437351"
    })
    .then(message => console.log(message.sid));
  res.sendStatus(200);
});

app.get("/react", function(req, res) {
  res.render("react.ejs");
});

app.get("/game/:gameTitle/:gameCreator", function(req, res) {
  const title = req.params.gameTitle;
  const creator = req.params.gameCreator;
  res.render("game.ejs", {
    title: title,
    creator: creator
  });
});

app.listen("3000", function() {
  console.log("Website online.");
});
