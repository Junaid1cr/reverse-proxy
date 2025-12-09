const express = require("express");
const router = express.Router();
const proxyController = require("../controllers/proxyController");

router.post("/request", proxyController.handleRequest);
router.get("/stats", proxyController.getStats);
router.post("/clear-cache", proxyController.clearCache);
router.post("/reset-stats", proxyController.resetStats);

module.exports = router;
