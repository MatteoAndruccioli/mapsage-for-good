const jwt = require("jsonwebtoken")
const Chat = require("../models/chatsModel")
const userUtil = require("./utils/usersUtil")
var chatUtil = require('./utils/chatUtil')

//logged user retieves last messages from chat specified by id
exports.lastMessages = function(req, res){
    if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      const message_number = 7 //maximum number of messages retrieved
      const startIndex = req.body.firstElement
      const lastIndex =  req.body.firstElement + (message_number - 1)
      //looks for the chat and retrieves messages
      Chat.findById(req.body.chat_id, function(err, chat) {
        if (err) {
          res.send({ error: "error in finding chat by id" })
        } else {
          if (chat == null) {
            res.status(404).send({error: 'Chat does not exist'})
            return
          } else {
            let messagesToReturn = []
            if ([chat.user1, chat.user2].includes(decodedPayload._id)){
              messagesToReturn = chat.messages.reverse().slice(startIndex,lastIndex)
              const updateQueryPromise = chatUtil.setCurrentUserVisualized(chat, decodedPayload._id)
              updateQueryPromise.then(updateQuery => {
                if(!updateQuery.error){
                  res.json({ messages: messagesToReturn })
                } else {
                  res.json({error: updateQuery.error })
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
            res.json({ error:"user ids are the same id"})
            return
          }
          //check whether both users exist
          Promise.all([
            userUtil.userWithIdExists(decodedPayload._id),
            userUtil.userWithIdExists(req.body.receiver)
          ]).then(([p1, p2]) => {
            if (!p1.error && !p2.error) {
              //chat doesn't exist but both user exist, a new chat has to be created
              const newChat = {
                user1: decodedPayload._id,
                user2: req.body.receiver,
                visualized_by_user1: true,
                visualized_by_user2: true,
                nextMessagePosition: 0,
                messages: []
              }
              Chat.create(newChat).then(chat => {
                res.json({
                  visualized: true,
                  chat_id: chat._id,
                  receiver_fullName: chatUtil.getUserFullName(p2.type, p2.user),
                  receiver_imgPath: p2.user.profile_picture,
                  receiver_id: req.body.receiver
                })
              }) .catch(err => {
                res.json({error: "mongoose error while adding new chat"})
              })
            } else {
              res.json({error: 'Chat did not exist and at least one of the two user ids is wrong (no user with that id)'})
            }
          }).catch(err => {res.json({ error: "error handling check on users id"}) })
        } else {
          userUtil.userWithIdExists(req.body.receiver).then(p => {
            res.json({
              visualized: chatUtil.hasSenderVisualized(storedChat, decodedPayload._id),
              chat_id: storedChat._id,
              receiver_fullName: chatUtil.getUserFullName(p.type, p.user),
              receiver_imgPath: p.user.profile_picture,
              receiver_id: req.body.receiver
            })
          }).catch(err => {
            res.json({ error: "error handling check on receiver id"})
          })
        }
      }).catch(err => {
        res.json({ error: "mongoose error while checking if chat already exists" })
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
        $or: [{user1: decodedPayload._id}, {user2: decodedPayload._id}]
      }).then(chats => {
        if(chats) {
          let chatsInfoPromises = [] //chat info list to return
          for (i = 0; i < chats.length; i++) {
            const currentChat = chats[i]
            const receiver = currentChat.user1 == decodedPayload._id ? currentChat.user2 : currentChat.user1
            chatsInfoPromises.push(chatUtil.getChatInfo(receiver, decodedPayload._id, currentChat))
          }

          Promise.allSettled(chatsInfoPromises).then(results => {
            let chatInfoToRet = []
            results.forEach((result) => {
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
            res.json({error: "error handling chat info promises"})
          })
        } else {
          res.json({error: 'Chat does not exist'})
        }
      }).catch(err => {
        res.json({error: 'chat not found'})
      })
    } catch (error) {
      res.sendStatus(401); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401); // No JWT specified
  }
}
