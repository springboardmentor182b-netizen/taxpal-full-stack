import express from 'express';
import dashboardRoutes from './api/modules/dashboard/dashboard.routes';

const app = express(); // create express app first

// register routes
app.use('/api/v1/dashboard', dashboardRoutes);

// simple route
app.get('/', (req, res) => {
  res.send('Hello from Express 🚀');
});

// start server
app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
