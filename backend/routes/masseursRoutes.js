module.exports = function(app) {
	var masseursController = require('../controllers/masseursController')

	app.route('/masseurs/register')
		.post(masseursController.handleRegisterRequest)

	// Deve essere un rotta per recuperare le info dell'utente che fa la richiesta
	// per poi utilizzarle per compilare profilo utente prima di visualzizarlo.
	// Sfrutta JWT per capire chi è l'utente.
	app.route('/masseurs/profile')
		.get(masseursController.readMasseurByJwt)

	// Deve essere una rotta per recuperare le info di un certo utente
	// dato in input il suo _id.
	app.route('/masseurs/:id')
		.get(masseursController.readMasseurById)

	app.route('/masseurs/masseursByLocation')
		.post(masseursController.readMasseursByLocation)

	app.route('/masseurs/adverisement')
		.post(masseursController.addAdvertisement)

	app.route('/masseurs/edit')
		.post(masseursController.editMasseurInfo)

	app.route('/masseurs/editLocation')
		.put(masseursController.editMasseurLocation)
};
