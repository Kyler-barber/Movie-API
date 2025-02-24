const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Movie Schema
let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // Optional in JSON data
  genre: {
    name: String,
    description: String,
  },
  director: {
    name: String,
    bio: String,
  },
  actors: [String],
  imagePath: String, // Optional field if not present in JSON
  featured: Boolean,
  releaseYear: Number, // Added based on JSON data
  runtimeMinutes: Number,
});

// User Schema
let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to validate password
userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Export Models
let User = mongoose.model("User", userSchema);
module.exports.User = User;
module.exports.Movie = Movie;
module.exports.User = User;
