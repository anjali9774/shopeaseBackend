const getTokenFromHeader = (req) => {
  // Get token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  return token || null;
};

module.exports = getTokenFromHeader;
