const mongoose = require('mongoose');

// Movie Schema
let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },  // Optional in JSON data
  genre: {
    name: String,
    description: String
  },
  director: {
    name: String,
    bio: String
  },
  actors: [String],
  imagePath: String,  // Optional field if not present in JSON
  featured: Boolean,
  releaseYear: Number,  // Added based on JSON data
  runtimeMinutes: Number
});

// User Schema
let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// Export Models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
