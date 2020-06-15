module.exports = function(app) {
	var masseursController = require('../controllers/masseursController')

	app.route('/masseurs/register')
		.post(masseursController.handleRegisterRequest)

	app.route('/masseurs/login')
		.post(masseursController.handleLoginRequest)

	// Deve essere un rotta per recuperare le info del massaggiatore che fa la richiesta
	// per poi utilizzarle per compilare profilo massaggiatore prima di visualzizarlo.
	// Sfrutta JWT per capire chi è il massaggiatore.
	app.route('/masseurs/profile')
		.get(masseursController.readMasseurByJwt)

	// Deve essere una rotta per recuperare le info di un certo massaggiatore
	// dato in input il suo _id.
	app.route('/masseurs/:id')
		.get(masseursController.readMasseurById)

	app.route('/masseurs')
		.post(masseursController.readMasseursByLocation)
};
