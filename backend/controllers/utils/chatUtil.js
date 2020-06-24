const Chat = require("../../models/chatsModel")
const Customer = require("../../models/customersModel")
const Masseur = require("../../models/masseursModel")

//used by setVisualized and getLastMessages to update user visualized
// on success => returns  { succeeded: true, chat: {...} }
// on fail    => returns  { succeeded: false, description: "...", error: "..." }
exports.setCurrentUserVisualized = function(chat, currentUserID){

  return new Promise((resolve, reject) => {
    let new_visualized_by_user1 = chat.visualized_by_user1
    let new_visualized_by_user2 = chat.visualized_by_user2

    if (chat.user1 == currentUserID) {
      //poichè sender è user1 => user1 ha visualizzato il messaggio
      new_visualized_by_user1 = true
    } else if (chat.user2 == currentUserID){
      //poichè sender è user2 => user2 ha visualizzato il messaggio
      new_visualized_by_user2 = true
    } else {
      //questa eventualità non si dovrebbe mai verificare
      reject( { succeeded: false, description: "sender doesn't match with any of two users in chat" })
    }

    //aggiungo il nuovo messaggio all'oggetto chat,
    //aggiorno valore di nextMessagePosition e visualized_by_user1 e visualized_by_user2

    Chat.findOneAndUpdate(
      {_id: chat._id},
      {
        visualized_by_user1: new_visualized_by_user1,
        visualized_by_user2: new_visualized_by_user2,
      },
      {new: true},
      (err, updatedChat) => {
        if (err) {
          reject({ succeeded: false, description: "Something wrong when chat data!", error: err })
        } else {
          resolve({ succeeded: true, chat: updatedChat })
        }
      })
      .catch(err => {
        reject({ succeeded: false, description: "Mongoose error while updating chat data", error: err })
      })
  });

}

//returns user when succedes in order to support both getChatIdByUsersId and getChatInfoByUsersId
//check if there is a user (masseur or customer) with specified id
exports.userWithIdExists = function(userID) {
  return new Promise((resolve, reject) => {
    Masseur.findById(userID, function(err, user) {
      if (err) {
        reject({ succeeded: false, error: err, description: "error in masseur search" })
      } else {
        if (user == null) {
          //user is not a masseur but he could be a customer
          Customer.findById(userID, function(err1, user1) {
            if (err1) {
              reject({ succeeded: false, error: err1, description: "error in customer search"  })
            } else {
              if (user1 == null) {
                //user is not masseur nor customer
                reject({ succeeded: false, description: "user_id doesn't match any entry"  })
              } else {
                //user is a customer
                resolve({ succeeded: true, type: "customer", user: user1 })
              }
            }
          })
        } else {
          //user is a masseur
          resolve({ succeeded: true, type: "masseur", user: user})
        }
      }
    })
  })
}

//retrieves user full name checking if user is a masseur or a customer
exports.getUserFullName = function(userType, user){
  if(userType == 'masseur') return user.brand_name
  if(userType == 'customer') return user.first_name + user.last_name
  return ''
}

//retrieves sender visualized info
exports.hasSenderVisualized = function(chat, sender){
  if (sender == chat.user1) return chat.visualized_by_user1
  if (sender == chat.user2) return chat.visualized_by_user2
}

//gets user's imgPath and user's fullname from user with userID specified
//returns object containing {receiver_imgPath, receiver_fullname, chat_id, receiver_user_id}
//riutilizzo userWithIdExists aggiungendo il fatto che ritorni l'user
exports.getChatInfo = function(userID, currentUserID, chat){
  return new Promise((resolve, reject) => {
    userWithIdExists(userID)
      .then(promise => {
        if(promise.succeeded){
          let fullName = ''

          if (promise.type == "masseur"){
            fullName = promise.user.brand_name
          } else if (promise.type == "customer"){
            fullName = promise.user.first_name + " " + promise.user.last_name
          } else {
            reject({ succeeded: "false", description: "user's type not sound", typeFound: promise.type})
          }

          const imgPath = promise.user.profile_picture

          resolve({ succeeded: "true",
            currentUserVisualized: hasSenderVisualized(chat, currentUserID),
            chat_id: chat._id,
            receiver_id: userID,
            fullName: fullName,
            imgPath: imgPath
          })
        } else {
          reject({ succeeded: "false", description: "failure in user search", moreInfo: promise})
        }
      }).catch(err => {
        reject({ succeeded: "false", description: "error in getUserChatInfo promise handling", error: err})
      })
  })
}