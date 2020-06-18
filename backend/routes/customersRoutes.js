module.exports = function(app) {
	var customersController = require('../controllers/customersController')

	app.route('/customers/register')
		.post(customersController.handleRegisterRequest)

	// Deve essere un rotta per recuperare le info del cliente che fa la richiesta
	// per poi utilizzarle per compilare profilo cliente prima di visualizzarlo.
	// Sfrutta JWT per capire chi è il cliente.
	app.route('/customers/profile')
		.get(customersController.readCustomerByJwt)

	// Deve essere una rotta per recuperare le info di un certo cliente
	// dato in input il suo _id.
	app.route('/customers/:id')
		.get(customersController.readCustomerById)
};
