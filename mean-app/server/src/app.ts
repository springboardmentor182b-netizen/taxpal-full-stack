import express from 'express';

const app = express();

// simple route
app.get('/', (req, res) => {
  res.send('Hello from Express 🚀');
});

// ❌ if you don’t add this, Node exits immediately
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
