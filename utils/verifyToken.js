const jwt = require('jsonwebtoken');
const JWT_SECRET = "i-have-to-become-a-fullstack-developer"; 

exports.verifyToken = (token) => {
  if (!token) {
    throw new Error("No token found");
  }

  try {
    // Verify the token synchronously
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded token contains the userId field
    if (!decoded.userId) {
      throw new Error("Token does not contain userId");
    }

    return decoded;
  } catch (error) {
    // If verification fails, return null
    return null;
  }
};