const jwt = require('jsonwebtoken');
const secretKey = 'khoa_bi_mat_cua_ban_de_o_day'; // Match the key used in authController
// Check whether the user provided a token (logged in?)
exports.verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).send({ message: "Token not found, please login!" });
  }

  
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token or token has expired!" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Verify if user is Admin
exports.isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).send({ message: "Admin privilege required to perform this action!" });
  }
  next();
};