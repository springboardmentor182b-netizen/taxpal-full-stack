const jwt = require('jsonwebtoken');
require('dotenv').config();

// Fake user ID for testing
const user_id = "000000000000000000000001"; 

// Generate token
const token = jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log("Your test JWT token:");
console.log(token);

