// Prometheus metrics configuration

const client = require("prom-client");

// collect default nodejs metrics
client.collectDefaultMetrics();

module.exports = client;
