const jwt = require("jsonwebtoken")
const Chat = require("../models/chatsModel")
const Customer = require("../models/customersModel")
const Masseur = require("../models/masseursModel")


//used by setVisualized and getLastMessages to update user visualized
// on success => returns  { succeeded: true, chat: {...} }
// on fail    => returns  { succeeded: false, description: "...", error: "..." }
setCurrentUserVisualized = function(chat, currentUserID){

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

//logged user retieves last messages from one of his chat specified by id
exports.lastMessages = function(req, res){
    if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

      //maximum number of messages retrieved
      const message_number = 7

      Chat.findById(req.body.chat_id, function(err, chat) {
        if (err) {
          res.send({ error: err, description: "error in finding chat by id" })
        } else {
          if (chat == null) {
            res.status(404).send({error: 'Chat does not exist'})
            return
          } else {
            // la chat è presente

            let messagesToReturn = []

            if ([chat.user1, chat.user2].includes(decodedPayload._id)){
              //ok uno dei due utenti è chi sta effettuando la richiesta quindi tutto ok
              if(chat.messages.length<message_number){
                messagesToReturn = chat.messages
              } else {
                messagesToReturn = chat.messages.slice((chat.messages.length - message_number), chat.messages.length)
              }


              const updateQueryPromise = setCurrentUserVisualized(chat, decodedPayload._id)

              updateQueryPromise
                .then(updateQuery => {
                  if(updateQuery.succeeded){
                    res.json({ messages: messagesToReturn })
                  } else {
                    res.json({ description: updateQuery.description, error: updateQuery.error })
                  }
                }).catch( err => res.json({ error: err}))

            } else {
              res.json({error: "invalid user_id for specified chat"})
            }
          }
        }
      })

    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}

//returns user when succedes in order to support both getChatIdByUsersId and getChatInfoByUsersId
//check if there is a user (masseur or customer) with specified id
userWithIdExists = function(userID) {
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
getUserFullName = function(userType, user){
  if(userType == 'masseur') return user.brand_name
  if(userType == 'customer') return user.first_name + user.last_name
  return ''
}

//logged user retrieves chat-id of his chat with reciver specified by user id
exports.chatInfoByUsersId = function(req, res){

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

      Chat.findOne({
        $or: [
          {user1: decodedPayload._id, user2: req.body.receiver},
          {user1: req.body.receiver, user2: decodedPayload._id}
        ]
      }).then(storedChat => {
        if (storedChat == null) {
          if (decodedPayload._id == req.body.receiver) {
            res.json({ error:"user ids are the same id", description: "user doesn't need a chat to talk to himself" })
            return
          }

          //tutto ok ci si può lavorare

          //devo controllare se i due utenti esistono: se esistono creo la nuova chat

          Promise.all([
            userWithIdExists(decodedPayload._id),
            userWithIdExists(req.body.receiver)
          ]).then(([p1, p2]) => {
            if (p1.succeeded && p2.succeeded) {
              //chat doesn't exist but both user exist, a new chat has to be created

              const newChat = {
                user1: decodedPayload._id,
                user2: req.body.receiver,
                visualized_by_user1: true,
                visualized_by_user2: true,
                nextMessagePosition: 0,
                messages: []
              }

              Chat
              .create(newChat)
                .then(chat => {

                  res.json({
                    visualized: true,
                    chat_id: chat._id,
                    receiver_fullName: getUserFullName(p2.type, p2.user),
                    receiver_imgPath: p2.user.profile_picture,
                    receiver_id: req.body.receiver
                  })
                }) .catch(err => {
                  res.json({ error: err, description: "mongoose error while adding new chat" })
                })

            } else {
              res.json({ error: 'Chat did not exist and at least one of the two user ids is wrong (no user with that id)' })
            }
          }).catch(err => { res.json({ error: err, description: "error handling check on users id"}) })

        } else {
          userWithIdExists(req.body.receiver)
            .then(p => {

              res.json({
                visualized: hasSenderVisualized(storedChat, decodedPayload._id),
                chat_id: storedChat._id,
                receiver_fullName: getUserFullName(p.type, p.user),
                receiver_imgPath: p.user.profile_picture,
                receiver_id: req.body.receiver
              })


            }).catch(err => {
              res.json({ error: err, description: "error handling check on receiver id"})
            })
        }

      }).catch(err => {
        res.json({ error: err, description: "mongoose error while checking if chat already exists" })
      })

    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }

}

//retrieves sender visualized info
hasSenderVisualized = function(chat, sender){
  if (sender == chat.user1) return chat.visualized_by_user1
  if (sender == chat.user2) return chat.visualized_by_user2
}

//gets user's imgPath and user's fullname from user with userID specified
//returns object containing {receiver_imgPath, receiver_fullname, chat_id, receiver_user_id}
//riutilizzo userWithIdExists aggiungendo il fatto che ritorni l'user
getChatInfo = function(userID, currentUserID, chat){
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

//logged user retrieves basic info about all his chats with other users
exports.chatInfoByUsersId = function(req, res){
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

      Chat.find({
        $or: [
          {user1: decodedPayload._id},
          {user2: decodedPayload._id}
        ]
      }).then(chats => {
        if(chats) {

          //lista chat info da ritornare: {chat_id, destinatario_id, destinatario_imgPath}
          let chatsInfoPromises = []
          for (i = 0; i < chats.length; i++) {
            const currentChat = chats[i]

            const receiver = currentChat.user1 == decodedPayload._id ? currentChat.user2 : currentChat.user1

            //inserisco la promise che conterrà l'info sulla chat nell'array
            chatsInfoPromises.push(getChatInfo(receiver, decodedPayload._id, currentChat))
          }

          Promise
            .allSettled(chatsInfoPromises)
            .then(results => {
              let chatInfoToRet = []

              results
                .forEach((result) => {
                  if(result.status == "fulfilled"){
                    chatInfoToRet.push({
                      visualized: result.value.currentUserVisualized,
                      chat_id: result.value.chat_id,
                      receiver_id: result.value.receiver_id,
                      receiver_fullName: result.value.fullName,
                      receiver_imgPath: result.value.imgPath,
                    })
                  }
                })

              res.json({chats: chatInfoToRet})
            }).catch(err => {
              res.json({error: err, description: "error handling chat info promises"})
            })

          //chiama funzione
        } else {
          res.json({ error: 'Chat does not exist' })
        }
      }).catch(err => {
        res.json({ error: err, info: 'chat not found' })
      })

    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}