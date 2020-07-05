//these routes provide API to interact with masseurs' stored data
module.exports = function(app) {
	var masseursController = require('../controllers/masseursController')

	app.route('/masseurs/register').post(masseursController.handleRegisterRequest)

	app.route('/masseurs/profile').get(masseursController.readMasseurByJwt)

	app.route('/masseurs/:id').get(masseursController.readMasseurById)

	app.route('/masseurs/masseursByLocation').post(masseursController.readMasseursByLocation)

	app.route('/masseurs/edit').post(masseursController.editMasseurInfo)

	app.route('/masseurs/editLocation').put(masseursController.editMasseurLocation)
};
