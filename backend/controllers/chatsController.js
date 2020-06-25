const jwt = require("jsonwebtoken")
const Chat = require("../models/chatsModel")
const userUtil = require("./utils/usersUtil")
var chatUtil = require('./utils/chatUtil')

//logged user retieves last messages from one of his chat specified by id
exports.lastMessages = function(req, res){
    if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

      //maximum number of messages retrieved
      const message_number = 7
       
      //const startIndex = (req.body.firstElement-1) >= 0 ? (req.body.firstElement-1) : 0
      //const lastIndex =  req.body.firstElement-1+message_number
      

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
              
              // COMMENTA DA QUA
              if(chat.messages.length<message_number){
                messagesToReturn = chat.messages
              } else {
                messagesToReturn = chat.messages.slice((chat.messages.length - message_number), chat.messages.length)
              }
              //COMMENTA FINO A QUA 

              //messagesToReturn = chat.messages.slice(startIndex,lastIndex)


              const updateQueryPromise = chatUtil.setCurrentUserVisualized(chat, decodedPayload._id)

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
            userUtil.userWithIdExists(decodedPayload._id),
            userUtil.userWithIdExists(req.body.receiver)
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
                    receiver_fullName: chatUtil.getUserFullName(p2.type, p2.user),
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
          userUtil.userWithIdExists(req.body.receiver)
            .then(p => {

              res.json({
                visualized: chatUtil.hasSenderVisualized(storedChat, decodedPayload._id),
                chat_id: storedChat._id,
                receiver_fullName: chatUtil.getUserFullName(p.type, p.user),
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

//logged user retrieves basic info about all his chats with other users
exports.getUserChats = function(req, res){
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
            chatsInfoPromises.push(chatUtil.getChatInfo(receiver, decodedPayload._id, currentChat))
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
