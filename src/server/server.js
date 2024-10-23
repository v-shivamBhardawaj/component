import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const fetchUsers = async () => {
  const response = await axios.get(
    "https://jellybellywikiapi.onrender.com/api/Beans?pageIndex=1&pageSize=10"
  );
  return response.data.items;
};

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Hello" });
});

let mockUsers = [];

const getUsers = async () => {
  if (mockUsers.length === 0) {
    mockUsers = await fetchUsers();
  }
  return mockUsers;
};

app.get("/api/users", async (req, res) => {
  const users = await getUsers();
  const { filter, value } = req.query;

  if (filter && value) {
    const filteredUsers = users.filter((user) => user[filter]?.includes(value));
    return res.send(filteredUsers);
  }

  return res.send(users);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
