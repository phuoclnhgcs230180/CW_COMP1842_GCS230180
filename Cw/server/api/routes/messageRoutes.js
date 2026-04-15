// server/api/routes/messageRoutes.js
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = (app) => {
  // Send message (requires authentication)
  app.post('/api/messages/send', authMiddleware.verifyToken, messageController.sendMessage);

  // Get messages for user (requires authentication)
  app.get('/api/messages', authMiddleware.verifyToken, messageController.getMessages);

  // Mark message as read (requires authentication)
  app.put('/api/messages/:id/read', authMiddleware.verifyToken, messageController.markAsRead);
};