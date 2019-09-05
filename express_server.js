const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const { getUserByEmail, generateRandomString, urlsForUser } = require("./helper");

const app = express();
const PORT = 8080; // default port 8080

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));
app.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");

const users = {};
const urlDatabase = {};

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});
// GET URLS //
app.get("/urls", (req, res) => {
  const data = urlsForUser(req.session.user_id, urlDatabase);
  let templateVars = {
    data,
    user_id: users[req.session.user_id]
  };
  if (users[req.session.user_id]) {
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});
// POST URLS //
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`);
});
// GET REGISTER //
app.get("/register", (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect("/urls");
  } else {
    let templateVars = {
      user_id: users[req.session.user_id]
    };
    res.render("urls_reg", templateVars);
  }
});
// POST REGISTER //
app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.send("Please fill in all fields");
  } else if (getUserByEmail(req.body.email, users)) {
    res.send("Email already exists");
  } else {
    const user = generateRandomString();
    users[user] = {
      id: user,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.user_id = user;
    res.redirect("/urls");
  }
});
// GET NEW //
app.get("/urls/new", (req, res) => {
  if (users[req.session.user_id]) {
    let templateVars = {
      user_id: users[req.session.user_id]
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});
// GET ACTUAL LINK TO SHORT URL //
app.get("/u/:shortURL", (req, res) => {
  if (users[req.session.user_id] && urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else res.redirect("/urls");
});
// GET SHORT URL //
app.get("/urls/:shortURL", (req, res) => {

  if (users[req.session.user_id] && urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user_id: users[req.session.user_id]
    };
    res.render("urls_show", templateVars);
  } else res.redirect("/urls");
});
// POST URL:SHORT DELETE //
app.post("/urls/:shortURL/delete", (req, res) => {
  if (users[req.session.user_id] && urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else res.send("400");
});
// POST REDIRECT TO ACTUAL SHORT URL //
app.post("/urls/:shortURL", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});
// POST EDIT SHORT URL
app.post("/urls/:shortURL/edit", (req, res) => {
  if (users[req.session.user_id] && urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect(`/urls`);
  } else res.send("You can not edit the short URL");
});
// GET LOGIN //
app.get("/login", (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect("/urls");
  } else {
    let templateVars = {
      user_id: users[req.session.user_id]
    };
    res.render("urls_login", templateVars);
  }
});
// POST LOGIN //
app.post("/login", (req, res) => {
  const result = getUserByEmail(req.body.email, users);
  if (result && users[result].password) {
    req.session.user_id = result;
    res.redirect("/urls");
  } else {
    res.send("Email and/or password are incorrect");
  }
});
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});