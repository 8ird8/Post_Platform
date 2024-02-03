const jwt = require('jsonwebtoken');
const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  jwt.verify(token, "arrrrrryskldmùdùfnhgzfdcevnkorp^rfnfbbfvdvd", (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Set isAuthenticated to true only when the token is valid
    req.user = user; 
    next();
  });
};

module.exports = authenticateToken;
