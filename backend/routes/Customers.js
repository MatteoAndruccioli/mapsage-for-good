module.exports = function(app) {
	var customersController = require('../controllers/Customers')

    process.env.SECRET_KEY = 'secret'

	app.route('/customers/register')
		.post(customersController.handleRegisterRequest)

	app.route('/customers/login')
		.post(customersController.handleLoginRequest)

	app.route('/customers/profile')
		.get(customersController.getClientData)
};
