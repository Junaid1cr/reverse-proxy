const express = require("express");
const app = express();
const PORT = 3001;
const SERVER_NAME = "Server-1";

app.use(express.json());

// Artificial delay to simulate processing
const delay = () => new Promise((resolve) => setTimeout(resolve, 200));

app.get("/data", async (req, res) => {
  await delay();
  res.json({
    message: "Data from backend server",
    server: SERVER_NAME,
    timestamp: new Date().toISOString(),
    data: {
      id: Math.floor(Math.random() * 1000),
      value: "Sample data",
    },
  });
});

app.get("/users", async (req, res) => {
  await delay();
  res.json({
    message: "Users data",
    server: SERVER_NAME,
    users: ["Alice", "Bob", "Charlie"],
  });
});

app.get("/products", async (req, res) => {
  await delay();
  res.json({
    message: "Products data",
    server: SERVER_NAME,
    products: ["Product A", "Product B", "Product C"],
  });
});

app.listen(PORT, () => {
  console.log(`${SERVER_NAME} running on port ${PORT}`);
});
