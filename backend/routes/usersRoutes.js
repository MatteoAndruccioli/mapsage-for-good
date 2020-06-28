module.exports = function(app) {
	var usersController = require('../controllers/usersController')

  app.route('/users/login')
    .post(usersController.handleLoginRequest)

	app.route('/users/logout')
		.get(usersController.handleLogoutRequest)
};
