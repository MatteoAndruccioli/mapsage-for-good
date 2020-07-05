//these routes manage chat data 
module.exports = function(app) {
  var chatController = require('../controllers/chatsController')

	app.route('/chat/lastMessages').put(chatController.lastMessages)

	app.route('/chat/chatInfo').put(chatController.chatInfoByUsersId)

	app.route('/chat/chatInfo/allOfUser').get(chatController.getUserChats)
}
