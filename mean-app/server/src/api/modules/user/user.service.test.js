const { registerUser, loginUser } = require('./user.service');
const { User } = require('./user.model');
const bcrypt = require('bcryptjs');

jest.mock('./user.model');
jest.mock('bcryptjs');

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if passwords do not match on register', async () => {
    await expect(registerUser({
      fullName: 'Test',
      email: 'test@example.com',
      username: 'test',
      password: '123456',
      confirmPassword: '654321',
      country: 'IN'
    })).rejects.toThrow('Passwords do not match');
  });

  it('should throw error if user not found on login', async () => {
    User.findOne.mockResolvedValue(null);
    await expect(loginUser({ email: 'notfound@example.com', password: '123456' }))
      .rejects.toThrow('Invalid email or password');
  });

  it('should throw error if email already exists on register', async () => {
    User.findOne.mockResolvedValue({ email: 'test@example.com' });
    await expect(registerUser({
      fullName: 'Test',
      email: 'test@example.com',
      username: 'test',
      password: '123456',
      confirmPassword: '123456',
      country: 'IN'
    })).rejects.toThrow('Email already exists');
  });
});
