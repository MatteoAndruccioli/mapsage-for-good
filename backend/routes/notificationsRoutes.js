module.exports = function(app) {

  var notificationsController = require('../controllers/notificationsController')

  //triggered after user visited masseur's page he is following, removes current 
	app.route('/notifications/remove').put(notificationsController.removeNotification)
}