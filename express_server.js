const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const generateRandomString = () => {
  return Math.random().toString(30).slice(2, 8)
}
app.set("view engine", "ejs");

const users = {}

const checkRegistration = (email, password) => {
  if (email && password) {
    for (id in users) {
      if (users[id].email === email) return false
    }
  } else return false
  return true
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.get("/urls", (req, res) => {
  let templateVars = {
    urlDatabase,
    user_id: req.cookies.user_id
  };
  console.log(req.cookies);
  res.render("urls_index", templateVars)
});
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
})
app.get("/register", (req, res) => {
  let templateVars = {
    urlDatabase,
    user_id: users[req.cookies.user_id]
  };
  res.render("urls_reg", templateVars);
})
app.post("/register", (req, res) => {
  if (!checkRegistration(req.body.email, req.body.password)) {
    res.sendStatus(400);
    // res.redirect("/register");
  } else {
    const user = generateRandomString();
    users[user] = {
      id: user,
      email: req.body.email,
      password: req.body.password
    }
    res.cookie("user_id", user);
    res.redirect("/urls");
  }
})
app.get("/urls/new", (req, res) => {
  let templateVars = {
    urlDatabase,
    user_id: users[req.cookies.user_id]
  };
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user_id: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});
app.post("/urls/:shortURL", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`)
})
app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls`)
})
app.get("/login", (req, res) => {
  let templateVars = {
    urlDatabase,
    user_id: users[req.cookies.user_id]
  };
  res.render("urls_login", templateVars)
})
app.post("/login", (req, res) => {
  for (user in users) {
    if (users[user].email === req.body.email) {
      // console.log(users[user].email, req.body.email)
      if (users[user].password === req.body.password) {
        // console.log(users[user].email, req.body.email)
        res.cookie("user_id", users[user].id)
        break;
      }
    }
  }
  res.redirect("/urls")
})
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});