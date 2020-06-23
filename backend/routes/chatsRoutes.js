module.exports = function(app) {
	
  var chatController = require('../controllers/chatsController')

  //logged user nofies visualization of messages in chat specified by id
	app.route('/chat/setVisualized').put(chatController.setVisualized)

  //logged user adds new message to chat specified by chat id
	app.route('/chat/newMsg').put(chatController.addNewMsg)

  //logged user retieves last messages from one of his chat specified by id
	app.route('/chat/lastMessages').put(chatController.getLastMessages)

  //logged user retrieves chat-id of his chat with reciver specified by user id 
	app.route('/chat/chatId').put(chatController.getChatIdByUsersId)

  //logged user retrieves basic info about all his chats with other users
	app.route('/chat/allChatsOfUser').get(chatController.getChatInfoByUsersId)
}