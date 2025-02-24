// index.js
require("dotenv").config({ path: "./jwt.env" });
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Models = require("./models.js");
const auth = require("./auth"); // Import auth routes as a router
require("./passport");

const app = express();
const port = process.env.PORT || 3000;
const Movies = Models.Movie;
const Users = Models.User;
const jwtSecret = process.env.JWT_SECRET;

// Connect to MongoDB
const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/your_database_name";
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Middleware
const cors = require("cors");
app.use(cors()); // Enable CORS for all routes
app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); // Initialize passport

// Register auth routes (including /login route)
app.use("/", auth);

// Password hashing function
async function hashPassword(plainPassword) {
  const saltRounds = 10;
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
}

// Public route: User registration without authentication
const { body, validationResult } = require("express-validator");

app.post(
  "/users",
  [
    body("username")
      .isLength({ min: 5 })
      .withMessage("Username must be at least 5 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("email").isEmail().withMessage("Invalid email format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email, birthday } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Users.create({
        username,
        password: hashedPassword,
        email,
        birthday,
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error });
    }
  }
);

// Public route: Login with JWT issuance
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "Login successful", token: "Bearer " + token });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error });
  }
});

// Protected route: Fetch movies (requires JWT authentication)
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movies = await Movies.find();
      res.status(200).json(movies);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
