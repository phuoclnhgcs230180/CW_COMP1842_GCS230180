// server/api/routes/authRoutes.js
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = (app) => {
  // Login is public
  app.post('/api/auth/login', authController.login);
  
  // Register (create Admin/Staff)
  app.post('/api/auth/register', authController.register);

  // Change password (requires authentication)
  app.put('/api/auth/change-password', authMiddleware.verifyToken, authController.change_password);

  // Get users (admin only)
  app.get('/api/auth/users', authMiddleware.verifyToken, authMiddleware.isAdmin, authController.getUsers);
};