const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'mentorsity',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Note: In a production environment, set secure to true if using HTTPS
}));

// Sample user data (you would use a database in a real-world scenario)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user in the sample user data
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Set session variable
    req.session.user = user;
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Signup API
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken (we would use a database in a real-world scenario)
  const isUsernameTaken = users.some(u => u.username === username);

  if (isUsernameTaken) {
    res.status(400).send('Username already taken');
  } else {
    // Create a new user (we would save this information to a database in a real-world scenario)
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);

    // Set session variable
    req.session.user = newUser;
    res.status(201).send('Signup successful');
  }
});

// Logout API
app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.status(200).send('Logout successful');
    }
  });
});

// Protected API that requires authentication
app.get('/dashboard', (req, res) => {
  // Check if the user is authenticated (logged in)
  if (req.session.user) {
    res.status(200).send(`Welcome, ${req.session.user.username}!`);
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
