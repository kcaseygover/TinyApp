'use strict'

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

const users = {};

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.use(bodyParser.urlencoded({extended:false}));

app.set("view engine", "ejs");

function generateRandomString() {
  let shortURL = [];
  let possibilities = 'abcdefghijkmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 6 ; i++){
    shortURL[i] = possibilities[Math.floor(Math.random() * 36)];
  }
  return shortURL.join('');
};

let searchEmail = function(obj, query) {
  for (var key in obj) {
    let value = obj[key].email;
    if (value === query) {
      return obj[key];
    }
  }
  return null;
};

let searchPassword = function(obj, query) {
  for (let key in obj) {
    let value = obj[key].password;
    if (value === query) {
      return obj[key];
    }
  }
  return null
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(users[req.session.user_id]['links']);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {

  let templateVars = {};
  if (users[req.session.user_id]) {
    templateVars = { urls: users[req.session.user_id]['links'], user_id: req.session.user_id, email: users[req.session.user_id]['email']};
    } else {
      templateVars = {user_id: null, email: null}
    }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: users[req.session.user_id]['links'], user_id: req.session.user_id, email: users[req.session.user_id]['email']};
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  users[req.session.user_id]['links'][generateRandomString()] = req.body.longURL;
  res.redirect('/urls')
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = users[req.session.user_id]['links'][shortURL];
  res.redirect(302, longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  delete users[req.session.user_id]['links'][req.params.id];
  res.redirect(302, "/urls");
});

app.post("/urls/:id/update", (req, res) => {
  let longURLreplace = req.body.longURLreplace;
  users[req.session.user_id]['links'][req.params.id] = longURLreplace;
  res.redirect(302, '/urls');
});

app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  if(!req.body.email || !req.body.password) {
    res.status(400).send("The email or password field is empty");
  } else if (searchEmail(users, req.body.email)) {
    res.status(400).send("That email is already registered");
  } else {
    const userRandomID = {};
    userRandomID["id"] = generateRandomString();
    userRandomID["email"] = req.body.email;
    userRandomID["password"] = bcrypt.hashSync(req.body.password, 10);
    userRandomID['links'] = {};
    users[userRandomID['id']] = userRandomID;
    req.session.user_id = userRandomID['id'];
    res.redirect(302, '/urls');
  };
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  var user = searchEmail(users, req.body.email);
  if (user && (bcrypt.compareSync(req.body.password, user.password))) {
    req.session.user_id = user['id'];
      res.redirect('/urls');
  } else {
    res.status(403).send("The email or password is incorrect");
  }
});

app.get("/urls/:id", (req, res) => {
  let longURL = users[req.session.user_id]['links'][req.params.id];
  let templateVars = { shortURL: req.params.id, website: longURL};
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});