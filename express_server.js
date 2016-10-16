'use strict'

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur"; // you will probably this from req.params
const hashed_password = bcrypt.hashSync(password, 10);

const users = {};

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:false}));

app.set("view engine", "ejs");

const urlDatabase = {};

function generateRandomString() {
  let randomStr = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);
  return randomStr;
}

app.get("/", (req, res) => {
  res.end("Hello!");/*change to res.render(/....)????? OR take out?????*/
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, email: req.cookies["email"], password: req.cookies["password"]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { email: req.cookies["email"], password: req.cookies["password"]};
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); /*this line can be removed*/
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
  console.log(urlDatabase[req.params.id]);
  res.redirect(302, "/urls");
});
app.post("/urls/:id/update", (req, res) => {
  let longURLreplace = req.body.longURLreplace;
  urlDatabase[req.params.id] = longURLreplace;
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie('email', req.body.email);
  res.redirect('/urls');
});
app.get("/register", (req, res) => {
  res.render("register");
});

let searchEmail = function(obj, query) {
  for (var key in obj) {
    let value = obj[key].email;
    if (value === query) {
      return obj[key];
    }
  }
  return null;
};
app.post("/register", (req, res) => {
  if(!req.body.email || !req.body.password) {
    res.status(400).send("The email or password field is empty");
  } else if (searchEmail(users, req.body.email)) {
    res.status(400).send("That email is already registered");
  } else {
  const userRandomID = {};
  userRandomID["id"] = generateRandomString();
  userRandomID["email"] = req.body.email;
  userRandomID["password"] = req.body.password;
  users[userRandomID['id']] = userRandomID;
  res.cookie("email", req.body.email);
  res.redirect(302, '/urls');
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});


app.post("/login", (req, res) => {
  let searchPassword = function(obj, query) {
      for (let key in obj) {
        let value = obj[key].password;
        if (value === query) {
          return obj[key];
        }
      }

      return null
    }

  if (searchEmail(users, req.body.email) && searchPassword(users, req.body.password)) {
      console.log(searchEmail(users, req.body.email));
      console.log(searchPassword(users, req.body.password));
      res.cookie('email', req.body.email);
      res.redirect('/urls');
  } else {
    res.status(403).send("The email or password is incorrect");
  }
});


app.get("/urls/:id", (req, res) => {
  let longURL = urlDatabase[req.params.id];
  let templateVars = { shortURL: req.params.id, website: longURL, email: req.cookies["email"], password: req.cookies["password"]};
  res.render("urls_show", templateVars);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});