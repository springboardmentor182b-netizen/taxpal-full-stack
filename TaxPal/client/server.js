const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 4200;

// API requests proxy
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    logLevel: 'debug',
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/taxpal-client')));

// All requests return the main index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/taxpal-client/index.html'));
});

app.listen(port, () => {
  console.log(`Client server running at http://localhost:${port}`);
});
