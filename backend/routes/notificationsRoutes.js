module.exports = function(app) {

  var notificationsController = require('../controllers/notificationsController')

  //set user notification as visualized
  app.route('/notifications/setVisualized').put(notificationsController.setVisualized)

  //get N notification (if prensent) from specified index   
  app.route('/notifications/getSet').get(notificationsController.getNotificationSet)

}