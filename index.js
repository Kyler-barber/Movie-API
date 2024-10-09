const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

// Middleware to log requests
app.use(morgan('common'));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Route for top 10 movies
app.get('/movies', (req, res) => {
  res.json([
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Dark Knight', year: 2008 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Interstellar', year: 2014 }
  ]);
});

// Regular route
app.get('/', (req, res) => {
  res.send('Welcome to the Movie API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Starts the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
