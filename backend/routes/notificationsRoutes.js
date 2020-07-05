//these routes manage users' advertisement notification 
module.exports = function(app) {
  var notificationsController = require('../controllers/notificationsController')

  app.route('/notifications/setVisualized').put(notificationsController.setVisualized)

  app.route('/notifications/getSet').get(notificationsController.getNotificationSet)
}