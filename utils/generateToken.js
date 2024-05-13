const jwt = require('jsonwebtoken');
const JWT_SECRET = "i-have-to-become-a-fullstack-developer"; // Assuming you're storing the secret key in an environment variable

const generateToken = (userId) => {
  if (!JWT_SECRET) {
    throw new Error('JWT secret key is missing.');
  }

  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
};

module.exports = { generateToken };
