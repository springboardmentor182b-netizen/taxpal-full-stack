const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server'); // Adjust path if needed
const Category = require('../src/apis/Categories/categoriesModel');
const User = require('../src/apis/auth/User'); // Adjust path if needed

jest.setTimeout(30000); // Increase timeout to 30 seconds

describe('Categories API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/taxpal_test');

    // Create a test user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com'
      // Removed password field as User model does not have it
    });
    await user.save();
    userId = user._id;

    // Generate token (assuming you have a function for this)
    const jwt = require('jsonwebtoken');
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    // Clean up
    await Category.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Category',
          description: 'A test category',
          isActive: true
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toEqual('Test Category');
      expect(res.body.userId).toEqual(userId.toString());
    });
  });

  describe('GET /api/categories', () => {
    it('should get all categories for the user', async () => {
      const res = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/categories/:id', () => {
    let categoryId;

    beforeAll(async () => {
      const category = new Category({
        name: 'Test Category 2',
        userId
      });
      await category.save();
      categoryId = category._id;
    });

    it('should get a category by id', async () => {
      const res = await request(app)
        .get(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toEqual(categoryId.toString());
    });
  });

  describe('PUT /api/categories/:id', () => {
    let categoryId;

    beforeAll(async () => {
      const category = new Category({
        name: 'Test Category 3',
        userId
      });
      await category.save();
      categoryId = category._id;
    });

    it('should update a category', async () => {
      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Category'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual('Updated Category');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    let categoryId;

    beforeAll(async () => {
      const category = new Category({
        name: 'Test Category 4',
        userId
      });
      await category.save();
      categoryId = category._id;
    });

    it('should delete a category', async () => {
      const res = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Deleted successfully');
    });
  });
});
