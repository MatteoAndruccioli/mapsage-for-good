module.exports = function(app) {
	
  var chatController = require('../controllers/chatsController')

  //logged user nofies visualization of messages in chat specified by id
	app.route('/chat/setVisualized').put(chatController.setVisualized)

  //logged user retieves last messages from one of his chat specified by id
	app.route('/chat/lastMessages').put(chatController.getLastMessages)

  //logged user retrieves chat-info of his chat with reciver specified by user id 
	app.route('/chat/chatInfo').put(chatController.getChatInfoByUsersId)

  //logged user retrieves basic info about all his chats with other users
	app.route('/chat/chatInfo/allOfUser').get(chatController.getChatInfoByUsersId)
}