const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Models = require("./models.js");

const app = express();
const port = 3000;
const Movies = Models.Movie;
const Users = Models.User;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Movie_database", {});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully!");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Middleware
app.use(morgan("common"));
app.use(express.json());
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Movie API!" });
});

// Get all movies
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => res.status(200).json(movies))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error: " + error });
    });
});

app.get("/users", (req, res) => {
  console.log("GET /users endpoint hit");
  Users.find()
    .then((users) => {
      console.log("Users retrieved:", users);
      res.status(200).json(users);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error: " + error });
    });
});


// Get movie by title
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).json({ message: "Movie not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error: " + error });
    });
});

// Get genre by name
app.get("/genres/:name", (req, res) => {
  Movies.findOne({ "genre.name": req.params.name })
    .then((movie) => {
      if (movie && movie.genre) {
        res.json(movie.genre);
      } else {
        res.status(404).json({ message: "Genre not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error: " + error });
    });
});

// Get director by name
app.get("/directors/:name", (req, res) => {
  Movies.findOne({ "director.name": req.params.name })
    .then((movie) => {
      if (movie && movie.director) {
        res.json(movie.director);
      } else {
        res.status(404).json({ message: "Director not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error: " + error });
    });
});

// Register new user
app.post("/users", (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) return res.status(400).json({ message: req.body.username + " already exists" });
      else {
        Users.create({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          birthday: req.body.birthday
        })
        .then((user) => res.status(201).json(user))
        .catch((error) => res.status(500).json({ message: "Error: " + error }));
      }
    })
    .catch((error) => res.status(500).json({ message: "Error: " + error }));
});



// Update user's info
app.put("/users/:username", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    { $set: req.body },
    { new: true }
  )
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error: " + error });
    });
});

// Add movie to user's favorites
app.post("/users/:username/favorites", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    { $push: { favoriteMovies: req.body.movieId } },
    { new: true }
  )
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error: " + error });
    });
});

// Remove movie from user's favorites
app.delete("/users/:username/favorites/:movieId", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    { $pull: { favoriteMovies: req.params.movieId } },
    { new: true }
  )
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error: " + error });
    });
});

// Deregister user
app.delete("/users/:email", (req, res) => {
  Users.findOneAndRemove({ email: req.params.email })
    .then((user) => {
      if (!user) {
        res.status(400).json({ message: `${req.params.email} was not found` });
      } else {
        res.status(200).json({ message: `${req.params.email} was deleted` });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error: " + error });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
