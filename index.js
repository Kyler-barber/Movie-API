const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

// Middleware to log requests and handle JSON
app.use(morgan('common'));
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Full list of movies with additional data
const movies = [
  { title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', director: 'Frank Darabont', featured: true, imageURL: 'https://image.shawshank.jpg' },
  { title: 'The Godfather', year: 1972, genre: 'Crime', director: 'Francis Ford Coppola', featured: true, imageURL: 'https://image.godfather.jpg' },
  { title: 'The Dark Knight', year: 2008, genre: 'Action', director: 'Christopher Nolan', featured: true, imageURL: 'https://image.darkknight.jpg' },
  { title: 'Pulp Fiction', year: 1994, genre: 'Crime', director: 'Quentin Tarantino', featured: true, imageURL: 'https://image.pulpfiction.jpg' },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003, genre: 'Fantasy', director: 'Peter Jackson', featured: true, imageURL: 'https://image.lotr.jpg' },
  { title: 'Forrest Gump', year: 1994, genre: 'Drama', director: 'Robert Zemeckis', featured: true, imageURL: 'https://image.forrestgump.jpg' },
  { title: 'Inception', year: 2010, genre: 'Sci-Fi', director: 'Christopher Nolan', featured: true, imageURL: 'https://image.inception.jpg' },
  { title: 'Fight Club', year: 1999, genre: 'Drama', director: 'David Fincher', featured: true, imageURL: 'https://image.fightclub.jpg' },
  { title: 'The Matrix', year: 1999, genre: 'Sci-Fi', director: 'Lana Wachowski, Lilly Wachowski', featured: true, imageURL: 'https://image.matrix.jpg' },
  { title: 'Interstellar', year: 2014, genre: 'Sci-Fi', director: 'Christopher Nolan', featured: true, imageURL: 'https://image.interstellar.jpg' }
];

// User data 
const users = [{ username: 'johnDoe', email: 'john@example.com', favorites: [] }];

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Movie API!');
});

// Get all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Get movie by title
app.get('/movies/:title', (req, res) => {
  const movie = movies.find(m => m.title === req.params.title);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send('Movie not found');
  }
});

// Get genre by name
app.get('/genres/:name', (req, res) => {
  const genreName = req.params.name;
  res.send({ name: genreName, description: `${genreName} genre description` });
});

// Get director by name
app.get('/directors/:name', (req, res) => {
  const directorName = req.params.name;
  res.send({ name: directorName, bio: `${directorName} bio`, birthYear: 1970 });
});

// Register new user
app.post('/users', (req, res) => {
  const newUser = { username: req.body.username, email: req.body.email, favorites: [] };
  users.push(newUser);
  res.send('New user registered.');
});

// Update user's username
app.put('/users/:username', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (user) {
    user.username = req.body.newUsername;
    res.send(`User info updated for username: ${req.params.username}.`);
  } else {
    res.status(404).send('User not found');
  }
});

// Add movie to user's favorites
app.post('/users/:username/favorites', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (user) {
    const movie = movies.find(m => m.title === req.body.movieTitle);
    if (movie) {
      user.favorites.push(movie.title);
      res.send(`Movie "${movie.title}" added to favorites for user: ${user.username}.`);
    } else {
      res.status(404).send('Movie not found');
    }
  } else {
    res.status(404).send('User not found');
  }
});

// Remove movie from user's favorites
app.delete('/users/:username/favorites/:title', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (user) {
    const movieIndex = user.favorites.indexOf(req.params.title);
    if (movieIndex !== -1) {
      user.favorites.splice(movieIndex, 1);
      res.send(`Movie "${req.params.title}" removed from favorites for user: ${user.username}.`);
    } else {
      res.status(404).send('Movie not found in favorites');
    }
  } else {
    res.status(404).send('User not found');
  }
});

// Deregister user
app.delete('/users/:email', (req, res) => {
  const userIndex = users.findIndex(u => u.email === req.params.email);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.send(`User with email: ${req.params.email} has been removed.`);
  } else {
    res.status(404).send('User not found');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
