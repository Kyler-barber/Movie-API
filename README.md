Movie API

The Movie API is a simple and easy-to-use RESTful service that provides access to a variety of movie details like title, director, genre, and release year. This API is perfect for developers who want to pull movie data into their apps. The API also logs requests using `morgan`, so you can monitor usage and keep track of what’s being accessed.

Features
- Get movie details: Retrieve movie information such as title, genre, director, and release year.
- User management: Register users and allow them to add/remove movies from their favorites list.
- Logging: Uses morgan for request logging.
- Middleware: Includes error handling middleware for graceful failure management.

Technologies
- HTML
- JavaScript
- JSON
- Express.js (REST framework)
- Node.js
- MongoDB and MongoDB Compass (for database management)
- Mongoose (for schema-based MongoDB data modeling)
- Morgan (for logging)
- Passport (Authentication middleware to handle secure user login sessions)
- Passport local (Strategy for Passport support)
- Passport JWT (handles JSON Web Tokens, used for secure, token-based user authentication)
- jsonwebtoken (Library for creating and verifying JWTs)
- Postman (Testing tool for simulating requests, checking API responses, and troubleshooting)

Dependencies

- Express.js: Web framework for Node.js
- Morgan: HTTP request logger middleware
- MongoDB: NoSQL database for storing movie and user data
- Mongoose: MongoDB object modeling tool to provide schema-based solutions for application data


API Endpoints

Movies
- GET /movies: Returns a list of all movies.
- GET /movies/:title: Returns details about a specific movie by title.
- PUT /movies/:title/description: Updates the description of a specific movie.

Genres
- GET /genres/:name: Returns details about a specific genre.

Directors
- GET /directors/:name: Returns bio and information about a specific director.
- PUT /directors/:name/bio: Updates the bio of a specific director.

Users
- POST /users: Registers a new user.
- PUT /users/:username: Updates a user’s username.
- POST /users/:username/favorites: Adds a movie to a user’s list of favorites.
- DELETE /users/:username/favorites/:title: Removes a movie from a user’s list of favorites.
- DELETE /users/:email: Deregisters a user by email.

