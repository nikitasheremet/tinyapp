const getUserByEmail = (email, database) => {
  for (user in database) {
    // console.log(user)
    if (database[user].email === email) return user
  }
  return null;
};

const generateRandomString = () => {
  return Math.random().toString(30).slice(2, 8)
}

const urlsForUser = (id, database) => {
  newData = JSON.parse(JSON.stringify(database));
  for (short in newData) {
    if (newData[short].userID !== id) {
      delete newData[short]
    }
  }
  return newData;
}

module.exports = { getUserByEmail, generateRandomString, urlsForUser }