const Chat = require("../../models/chatsModel")
const userUtil = require("./usersUtil")

//used by setVisualized and getLastMessages to update user visualized
setCurrentUserVisualized = function(chat, currentUserID){
  return new Promise((resolve, reject) => {
    //set up new values for visualized_by_user
    let new_visualized_by_user1 = chat.visualized_by_user1
    let new_visualized_by_user2 = chat.visualized_by_user2
    if (chat.user1 == currentUserID) {
      new_visualized_by_user1 = true
    } else if (chat.user2 == currentUserID){
      new_visualized_by_user2 = true
    } else {
      reject({error: "sender doesn't match with any of two users in chat"})
    }
    //adds new message and updates visualized_by_user fields
    Chat.findOneAndUpdate(
      {_id: chat._id},
      {
        visualized_by_user1: new_visualized_by_user1,
        visualized_by_user2: new_visualized_by_user2,
      },
      {new: true},
      (err, updatedChat) => {
        if (err) {
          reject({error: "Something wrong when chat data!"})
        } else {
          resolve({chat: updatedChat })
        }
      })
      .catch(err => {
        reject({error: "Mongoose error while updating chat data"})
      })
  });
}

//retrieves user full name checking if user is a masseur or a customer
getUserFullName = function(userType, user){
  if(userType == 'masseur') return user.brand_name
  if(userType == 'customer') return user.first_name + user.last_name
  return ''
}

//retrieves sender visualized info
hasSenderVisualized = function(chat, sender){
  if (sender == chat.user1) return chat.visualized_by_user1
  if (sender == chat.user2) return chat.visualized_by_user2
}

//gets user's imgPath and user's fullname from user with userID specified
//riutilizzo userWithIdExists aggiungendo il fatto che ritorni l'user
getChatInfo = function(userID, currentUserID, chat){
  return new Promise((resolve, reject) => {
    userUtil.userWithIdExists(userID)
      .then(promise => {
        if(!promise.error){
          let fullName = ''
          if (promise.type == "masseur"){
            fullName = promise.user.brand_name
          } else if (promise.type == "customer"){
            fullName = promise.user.first_name + " " + promise.user.last_name
          } else {
            reject({ error: "user's type not sound"})
          }
          const imgPath = promise.user.profile_picture
          resolve({
            currentUserVisualized: hasSenderVisualized(chat, currentUserID),
            chat_id: chat._id,
            receiver_id: userID,
            fullName: fullName,
            imgPath: imgPath
          })
        } else {
          reject({error: "failure in user search"})
        }
      }).catch(err => {
        reject({error: "error in getUserChatInfo promise handling"})
      })
  })
}

exports.setCurrentUserVisualized = setCurrentUserVisualized
exports.getUserFullName = getUserFullName
exports.hasSenderVisualized = hasSenderVisualized
exports.getChatInfo = getChatInfo