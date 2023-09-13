const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const moment = require('moment');

const app = express();
const port = 3000; 

app.use(bodyParser.json());

// loading credentials from given JSON file.
const userCredentials = JSON.parse(fs.readFileSync('user_credentials.json', 'utf8'));

const sampleSentence = "We design and develop applications that run the world and showcase the future.";


app.post('/login', (req, res) => {
});



// to track game winner and horly winner
const gameWinners = [];
const hourlyWinners = new Map();

// to check if a user is authenticated or not
function isAuthenticated(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const user = userCredentials.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.user = user;
  next();
}

// endpoint for user login
app.post('/login', isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'Login successful', user: req.user });
});

// endpoint to retrieve the sentence
app.get('/sentence', (req, res) => {
  res.status(200).json({ sentence: sampleSentence });
});

// endpoint to attempt the game
app.post('/attempt-game', isAuthenticated, (req, res) => {
  const { user } = req;

  //to check if user has already won this hour
  if (hourlyWinners.has(user.username)) {
    return res.status(403).json({ message: 'You have already won a game this hour.' });
  }

  // if horly limit of winning user is reached
  if (hourlyWinners.size >= 2) {
    return res.status(403).json({ message: 'Maximum number of winners for this hour reached.' });
  }


  const gameResult = correctWord.toUpperCase()[letterPos] === letter ? 'win' : 'lose';

  if (gameResult === 'win') {
    gameWinners.push(user.username);
    hourlyWinners.set(user.username, moment().format('YYYY-MM-DD HH'));

    res.status(200).json({ message: 'Congratulations! You won the game.' });
  } else {
    res.status(200).json({ message: 'Sorry, you lost the game.' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
