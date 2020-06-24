module.exports = function(app) {

  var chatController = require('../controllers/chatsController')

  //logged user retieves last messages from one of his chat specified by id
	app.route('/chat/lastMessages').put(chatController.lastMessages)

  //logged user retrieves chat-info of his chat with reciver specified by user id
	app.route('/chat/chatInfo').put(chatController.chatInfoByUsersId)

  //logged user retrieves basic info about all his chats with other users
	app.route('/chat/chatInfo/allOfUser').get(chatController.getUserChats)
}
