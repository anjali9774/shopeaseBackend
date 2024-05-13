const  getTokenFromHeader  = require('../utils/getTokenFromHeader'); // Assuming you have a function to generate tokens
const {verifyToken} = require("../utils/verifyToken");
exports.isLoggedIn = (req, res, next) => {
  // Get token from request header
  const token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({ status: "fail", message: "No token found in the header" });
  }

  // Verify the token
  const decodedUser = verifyToken(token);
  
  if (!decodedUser) {
    return res.status(401).json({ status: "fail", message: "Invalid/Expired token" });
  } else {
    // Save the user ID into req object
    req.userAuthId = decodedUser.userId; // Assuming the decoded token contains userId field
    next();
  }
};
