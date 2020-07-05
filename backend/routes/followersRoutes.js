//these routes manage users' follow functionality
module.exports = function(app) {
  var followersController = require('../controllers/followersController')

	app.route('/follow/add').put(followersController.follow)

	app.route('/follow/remove').put(followersController.unfollow)
}
