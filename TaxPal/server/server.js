// Import routes
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');

// ...existing code...

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// ...existing code...