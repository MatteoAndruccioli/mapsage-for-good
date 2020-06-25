module.exports = function(app) {

  var followersController = require('../controllers/followersController')

  //logged user (customer or masseur) start following masseur
	app.route('/follow/add').put(followersController.follow)

  //logged user (customer or masseur) stops following masseur
	app.route('/follow/remove').put(followersController.unfollow)
}
