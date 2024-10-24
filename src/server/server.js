import express from "express";
import axios from "axios";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// MongoDB connection
const mongoURI = "mongodb://localhost:27017"; // Replace with your actual connection string

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// User schema
const userSchema = new mongoose.Schema({
  beanId: { type: String, required: true },
  flavorName: { type: String, required: true },
  description: { type: String, required: true },
  groupName: { type: [String], required: true },
  ingredients: { type: [String], required: true },
  glutenFree: { type: Boolean, required: true },
  sugarFree: { type: Boolean, required: true },
  kosher: { type: Boolean, required: true },
  imageUrl: { type: String, required: true },
  backgroundColor: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
let cart = [];

// Fetch and store users from API
const fetchAndStoreUsers = async () => {
  const response = await axios.get(
    "https://jellybellywikiapi.onrender.com/api/Beans?pageIndex=1&pageSize=10"
  );
  const users = response.data.items;

  await User.insertMany(users);
};

// API to get users
app.get("/api/users", async (req, res) => {
  const { filter, value } = req.query;

  let query = {};
  if (filter && value) {
    query[filter] = { $regex: value, $options: "i" }; // Case-insensitive search
  }

  try {
    const users = await User.find(query);
    return res.send(users);
  } catch (error) {
    return res.status(500).send({ error: "Error fetching users" });
  }
});

// API to add beans to the cart
app.post("/api/cart", (req, res) => {
  const { beanId, flavorName } = req.body;

  cart.push({ beanId, flavorName });
  return res.status(201).send({ msg: "Added to cart", cart });
});

// Initialize and fetch users from API on server start
const init = async () => {
  await fetchAndStoreUsers();
};

init().catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
