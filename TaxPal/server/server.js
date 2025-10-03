// Import route files
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);