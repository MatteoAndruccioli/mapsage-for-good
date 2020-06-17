module.exports = function(app) {
	var masseursController = require('../controllers/usersController')

	// Passare nel body il profile_type ("Customer" oppure "Masseur") oltre alle altri info
	app.route('/users/register')
		.post(masseursController.handleRegisterRequest)

	app.route('/users/login')
		.post(masseursController.handleLoginRequest)

	// Deve essere un rotta per recuperare le info dell'utente che fa la richiesta
	// per poi utilizzarle per compilare profilo utente prima di visualzizarlo.
	// Sfrutta JWT per capire chi è l'utente.
	app.route('/users/profile')
		.get(masseursController.readUserByJwt)

	// Deve essere una rotta per recuperare le info di un certo utente
	// dato in input il suo _id.
	app.route('/users/:id')
		.get(masseursController.readUserById)

	app.route('/users/masseursByLocation')
		.post(masseursController.readMasseursByLocation)
};
