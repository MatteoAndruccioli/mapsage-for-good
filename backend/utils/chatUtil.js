const Chat = require("./models/chatsModel")


//add new message with payload specified in messageBody in chat with id chat_id and sent by sented
exports.addNewMsg = function(chat_id, sender, receiver, messageBody){
  return new Promise((resolve, reject) => {
    let receiver_id = ''

    Chat.findById(chat_id, function(err, chat) {
      if (err) {
        reject({ succeeded: false, error: err, description: "error in finding chat by id" })
      } else {
        if (chat == null) {
          reject({ succeeded: false, description: 'Chat does not exist'})
        } else {

          //creo il nuovo messaggio con dati presenti in chat e dati inviati
          const newMessage = {
            body: messageBody,
            sender: sender,
          }

          //updates user visualized info
          let new_visualized_by_user1 = false
          let new_visualized_by_user2 = false

          if (chat.user1 == sender) {
            new_visualized_by_user1 = true
            receiver_id = chat.user2
          } else if (chat.user2 == sender){
            new_visualized_by_user2 = true
            receiver_id = chat.user1
          } else {
            //this chat doesn't belong to specified user
            reject({ succeeded: false, description: "sender doesn't match with any of two users in chat"})
          }

          if (receiver_id != receiver){
            reject({ succeeded: false, description: "receiver id retrieved from database doesn't match with the one specified"})
          }

          //add new message, updates user visualized info
          Chat.findOneAndUpdate({_id: chat_id},
            {
              visualized_by_user1: new_visualized_by_user1,
              visualized_by_user2: new_visualized_by_user2,
              $addToSet: {messages: newMessage}
            },
            {new: true},
            (err, updatedChat) => {
              if (err) {
                reject({ succeeded: false,  description: "Something wrong when chat data!"})
              } else {
                resolve({
                  succeeded: true,
                  receiver_id: receiver,
                  chat_id: updatedChat._id,
                  sender_id: sender,
                  payload: messageBody,
                  description: "tutto ok chat aggiornata"
                })
              }
            })
            .catch(err => {
              reject({  succeeded: false, error: err, description: "Mongoose error while updating chat data" })
            })
        }
      }
    })
  })
}
