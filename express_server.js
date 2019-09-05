const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));
app.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require('bcrypt');

const generateRandomString = () => {
  return Math.random().toString(30).slice(2, 8)
}
app.set("view engine", "ejs");


// app.clearCookie("user_id");

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "trial@trial",
    password: bcrypt.hashSync('123', 10)
  }
}

const checkRegistration = (email, password) => {
  if (email && password) {
    for (id in users) {
      if (users[id].email === email) return false
    }
  } else return false
  return true
}

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ48lW" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "aJ48lW" }
};

const urlsForUser = (id) => {
  newData = JSON.parse(JSON.stringify(urlDatabase));
  for (short in newData) {
    if (newData[short].userID !== id) {
      delete newData[short]
    }
  }
  return newData;
}
// GET URLS //
app.get("/urls", (req, res) => {
  const data = urlsForUser(req.session.user_id);
  let templateVars = {
    data,
    user_id: users[req.session.user_id]
  };
  // console.log(req.cookies.user_id);
  res.render("urls_index", templateVars)
});
// POST URLS //
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});
// GET REGISTER //
app.get("/register", (req, res) => {
  let templateVars = {
    urlDatabase,
    user_id: users[req.session.user_id]
  };
  res.render("urls_reg", templateVars);
})
// POST REGISTER //
app.post("/register", (req, res) => {
  if (!checkRegistration(req.body.email, req.body.password)) {
    res.sendStatus(400);
  } else {
    const user = generateRandomString();
    users[user] = {
      id: user,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    }
    req.session.user_id = user;
    res.redirect("/urls");
  }
})
// GET NEW //
app.get("/urls/new", (req, res) => {
  if (req.cookies.user_id) {
    let templateVars = {
      urlDatabase,
      user_id: users[req.session.user_id]
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});
// GET ACTUAL LINK TO SHORT URL //
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});
// GET SHORT URL //
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user_id: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});
// POST URL:SHORT DELETE //
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id) {
    delete urlDatabase[req.params.shortURL]
    res.redirect("/urls")
  } else res.sendStatus(400);
})
// POST REDIRECT TO ACTUAL SHORT URL //
app.post("/urls/:shortURL", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`)
})
// POST EDIT SHORT URL
app.post("/urls/:shortURL/edit", (req, res) => {
  if (req.session.user_id) {
    urlDatabase[req.params.shortURL] = req.body.longURL;
    res.redirect(`/urls`)
  } else res.sendStatus(400);
})
// GET LOGIN //
app.get("/login", (req, res) => {
  let templateVars = {
    urlDatabase,
    user_id: users[req.session.user_id]
  };
  res.render("urls_login", templateVars)
})
// POST LOGIN //
app.post("/login", (req, res) => {
  // console.log("im here");
  for (user in users) {
    if (users[user].email === req.body.email) {
      // console.log(users[user].email === req.body.email)
      // console.log(users[user].password, req.body.password);
      if (bcrypt.compareSync(`${req.body.password}`, users[user].password)) {
        // console.log(users[user].password === req.body.password)
        req.session.user_id = users[user].id
        break;
      }
    }
  }
  res.redirect("/urls")
})
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});