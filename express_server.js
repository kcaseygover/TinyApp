'use strict'

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended:false}));

app.set("view engine", "ejs");

const urlDatabase = {
  "pppppp": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
function generateRandomString() {
  let randomStr = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);
  return randomStr;
}

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect('/urls')
});

app.get("/urls/:id", (req, res) => {
  let longURL = urlDatabase[req.params.id];
  let templateVars = { shortURL: req.params.id, website: longURL };
  res.render("urls_show", templateVars);
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
  let longURLreplace = req.body.longURL;
  console.log(longURLreplace);
  res.send('/urls/:id/update');
});
app.post("/urls", (req, res) => {
  res.redirect('/urls/:id/update');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});