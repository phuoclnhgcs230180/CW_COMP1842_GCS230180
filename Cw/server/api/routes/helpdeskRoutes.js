const helpdeskBuilder = require('../controllers/helpdeskController');
const authJwt = require('../middlewares/authMiddleware');
module.exports = app => {
  // Public route for Guest
  app.route('/public/responses/common')
    .get(helpdeskBuilder.list_common_responses);

  // Routes that require login (Staff + Admin can use)
  app.route('/responses')
    .get([authJwt.verifyToken], helpdeskBuilder.list_all_responses)
    // Only Admin can POST (create)
    .post([authJwt.verifyToken, authJwt.isAdmin], helpdeskBuilder.create_a_response);

  app.route('/responses/:responseId')
    .get([authJwt.verifyToken], helpdeskBuilder.read_a_response)
    // Only Admin can PUT (edit) and DELETE
    .put([authJwt.verifyToken, authJwt.isAdmin], helpdeskBuilder.update_a_response)
    .delete([authJwt.verifyToken, authJwt.isAdmin], helpdeskBuilder.delete_a_response);

  // Route to create new user (Admin only)
  app.route('/users')
    .post(helpdeskBuilder.create_a_user);
};