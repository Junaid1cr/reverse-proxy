const express = require("express");
const cors = require("cors");
const LRUCache = require("./cache/LRUCache.js");
const RoundRobinLoadBalancer = require("./loadBalancer/RoundRobin.js");
const proxyRoutes = require("./routes/proxyRoutes");
const { initializeProxy } = require("./controllers/proxyController");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const BACKEND_SERVERS = [
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
];

const cache = new LRUCache(100);

const loadBalancer = new RoundRobinLoadBalancer(BACKEND_SERVERS);

initializeProxy(cache, loadBalancer);

app.use("/api", proxyRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Reverse Proxy Server Running",
    backends: BACKEND_SERVERS,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Reverse Proxy Server running on port ${PORT}`);
  console.log(`📦 Backend Servers: ${BACKEND_SERVERS.join(", ")}`);
});
