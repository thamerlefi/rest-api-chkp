const express = require("express");
const mongoose = require("mongoose");

// Define the User model
const User = require("./models/User");

const app = express();

// require the .env config with path
require("dotenv").config({ path: "./config/.env" });

// Parse JSON bodies for incoming requests
app.use(express.json());

// GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// POST a new user
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT (edit) a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = User.findById(id)
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {new: true})
    if (!updatedUser) return res.status(404).json({ error: "User not found" })
    res.json({updatedUser});
  } catch (error) {
    res.status(500).json({ error: "Failed to update the user" });
  }
});

// DELETE a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" })
      res.json({ message: "User deleted", deletedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the user" });
  }
});

const port = process.env.PORT || 5000

// Connect to the database
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("connected to db"))
  .catch((error) => console.error("Error connecting to the database:", error));

// Start the server
app.listen(5000, () => console.log(`server listen on port ${port}`));
