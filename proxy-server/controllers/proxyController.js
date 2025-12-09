const axios = require("axios");
const { performance } = require("perf_hooks");

let cache;
let loadBalancer;
let stats = {
  totalRequests: 0,
  cacheHits: 0,
  cacheMisses: 0,
};

const initializeProxy = (lruCache, lb) => {
  cache = lruCache;
  loadBalancer = lb;
};

const handleRequest = async (req, res) => {
  const startTime = performance.now();
  stats.totalRequests++;
  const { path = "/data", method = "GET" } = req.body;
  const cacheKey = `${method}:${path}`;

  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    stats.cacheHits++;
    const durationMs = performance.now() - startTime;
    return res.json({
      source: "CACHE",
      data: cachedResponse,
      durationMs: Number(durationMs.toFixed(3)), // ms with millisecond precision
      timestamp: new Date().toISOString(),
    });
  }

  stats.cacheMisses++;
  const server = loadBalancer.getNextServer();

  try {
    const response = await axios({
      method,
      url: `${server}${path}`,
      timeout: 5000,
    });

    cache.put(cacheKey, response.data);

    const durationMs = performance.now() - startTime;
    res.json({
      source: server,
      data: response.data,
      durationMs: Number(durationMs.toFixed(3)),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Backend server error",
      message: error.message,
    });
  }
};

const getStats = (req, res) => {
  res.json({
    ...stats,
    cacheSize: typeof cache.size === "function" ? cache.size() : cache.length,
    cacheHitRate:
      stats.totalRequests > 0
        ? ((stats.cacheHits / stats.totalRequests) * 100).toFixed(2) + "%"
        : "0%",
  });
};

const clearCache = (req, res) => {
  if (typeof cache.clear === "function") cache.clear();
  res.json({ message: "Cache cleared successfully" });
};

const resetStats = (req, res) => {
  stats = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };
  res.json({ message: "Stats reset successfully" });
};

module.exports = {
  initializeProxy,
  handleRequest,
  getStats,
  clearCache,
  resetStats,
};
