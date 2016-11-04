'use strict'

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

const users = {};
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
 "9sm5xK": "http://www.google.com"
};

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
  if (users[req.session.user_id]) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});


app.get("/urls", (req, res) => {
  let templateVars = {};
  if (users[req.session.user_id]) {
    templateVars = { urls: urlDatabase, user_id: req.session.user_id, email: users[req.session.user_id]['email']};
  } else {
    templateVars = {user_id: null, email: null}
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, user_id: req.session.user_id, email: users[req.session.user_id]['email']};
  res.render("urls_new", templateVars);

});

app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect('/urls')
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(302, longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(302, "/urls");
});

app.post("/urls/:id/update", (req, res) => {
  let longURLreplace = req.body.longURLreplace;
  urlDatabase[req.params.id] = longURLreplace;
  res.redirect(302, '/urls');
});

app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect("/");
  } else {
    res.render("register");
  }
});

app.post("/register", (req, res) => {
  console.log('am i getting this far???/')
  if(!req.body.email || !req.body.password) {
    console.log('no email no pw')
    res.status(400).send("The email or password field is empty");
  } else if (searchEmail(users, req.body.email)) {
    console.log('already here')
    res.status(400).send("That email is already registered");
  } else {
    const userRandomID = {};
    userRandomID["id"] = generateRandomString();
    userRandomID["email"] = req.body.email;
    userRandomID["password"] = bcrypt.hashSync(req.body.password, 10);
    users[userRandomID['id']] = userRandomID;
    req.session['user_id'] = userRandomID['id'];
    res.redirect('/urls');
  };
});

app.get("/login", (req, res) => {
  if (!users[req.session.user_id]) {
    res.render("login");
  }
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
  let longURL = urlDatabase[req.params.id];
  let templateVars = { shortURL: req.params.id, website: longURL};
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
