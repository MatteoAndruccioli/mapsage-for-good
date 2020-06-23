const Chat = require("../models/chatsModel")
const Customer = require("../models/customersModel")
const Masseur = require("../models/masseursModel")
var mongoose = require('mongoose')


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

//logged user nofies visualization of messages in chat specified by id
exports.setVisualized = function(req, res){

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

      Chat.findById(req.body.chat_id, function(err, chat) {
        if (err) {
          res.json({ error: err, description: "error in finding chat by id" })
        } else {
          if (chat == null) {
            res.status(404).send({error: 'Chat does not exist'})
            return
          } else {
            // la chat è presente

          const updateQueryPromise = setCurrentUserVisualized(chat, decodedPayload._id)

          updateQueryPromise
            .then(updateQuery => {
              if(updateQuery.succeeded){
                res.json({ chat: updateQuery.chat })
              } else {
                res.json({ description: updateQuery.description, error: updateQuery.error })
              }
            }).catch( err => res.json({ error: err}))
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

//logged user adds new message to chat specified by chat id
exports.addNewMsg = function(req, res){
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

      Chat.findById(req.body.chat_id, function(err, chat) {
        if (err) {
          res.send({ error: err, description: "error in finding chat by id" })
        } else {
          if (chat == null) {
            res.status(404).send({ error: 'Chat does not exist'})
            return
          } else {
            // la chat è presente

            //creo il nuovo messaggio con dati presenti in chat e dati inviati
            const newMessage = {
              //la posizione dovrà essere settata in base ai nuovi valori
              position: chat.nextMessagePosition,
              body: req.body.messageBody,
              sender: decodedPayload._id,
            }

            //preparo il nuovo valore per nextMessagePosition
            const newNextMessagePosition = chat.nextMessagePosition + 1

            /*
              determino se il sender sia user1 o user2 => 
                mi serve per settare visualizzato = false per destinatario
                siccome mi sembra brutto fare due versioni dello stesso codice 
                in realtà vado a determinare i 2 valori di visualized
            */
            let new_visualized_by_user1 = false
            let new_visualized_by_user2 = false

            if (chat.user1 == decodedPayload._id) {
              //poichè sender è user1 => user1 ha visualizzato il messaggio
              new_visualized_by_user1 = true
            } else if (chat.user2 == decodedPayload._id){
              //poichè sender è user2 => user2 ha visualizzato il messaggio
              new_visualized_by_user2 = true
            } else {
              //questa eventualità non si dovrebbe mai verificare
              res.json({error: "sender doesn't match with any of two users in chat" })
              return
            }

            //aggiungo il nuovo messaggio all'oggetto chat, 
            //aggiorno valore di nextMessagePosition e visualized_by_user1 e visualized_by_user2
            
            Chat.findOneAndUpdate({_id: req.body.chat_id},
              {
                nextMessagePosition: newNextMessagePosition,
                visualized_by_user1: new_visualized_by_user1,
                visualized_by_user2: new_visualized_by_user2,
                //non ho problemi perchè contiene un campo con numero progressivo quindi i messaggi sono tutti diversi tra loro
                $addToSet: {messages: newMessage}
              }, 
              {new: true}, 
              (err, updatedChat) => {
                if (err) {
                  console.log("Something wrong when chat data!");
                  res.json({ error: "Something wrong when chat data!", description: updatedChat})
                  return
                } else {
                  res.json({ chat: updatedChat, description: "tutto ok chat aggiornata" })
                }
              })
              .catch(err => {
                res.json({ error: err, description: "Mongoose error while updating chat data" })
                return
              })


            //triggero l'invio del messaggio via Socket.IO

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

//logged user retieves last messages from one of his chat specified by id
exports.getLastMessages = function(req, res){
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

//logged user retrieves chat-id of his chat with reciver specified by user id 
exports.getChatIdByUsersId = function(req, res){

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
                  res.json({chat_id: chat._id})
                }) .catch(err => {
                  res.json({ error: err, description: "mongoose error while adding new chat" })
                })

            } else {
              res.json({ error: 'Chat did not exist and at least one of the two user ids is wrong (no user with that id)' })
            }
          }).catch(err => { res.json({ error: err, description: "error handling check on users id"}) })

        } else {
          res.json({ chat_id: storedChat._id })
        }

        //salvati da parte quando va tutto bene (magari setti a true una variabile)
        //qua devi aggiungere la emit per la nuova chat!!!

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


//gets user's imgPath and user's fullname from user with userID specified
//returns object containing {receiver_imgPath, receiver_fullname, chat_id, receiver_user_id}
//riutilizzo userWithIdExists aggiungendo il fatto che ritorni l'user
getChatInfo = function(userID, chat_id){
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
            chat_id: chat_id, 
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
exports.getChatInfoByUsersId = function(req, res){
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
            chatsInfoPromises.push(getChatInfo(receiver, currentChat._id))  
          }

          Promise
            .allSettled(chatsInfoPromises)
            .then(results => { 
              let chatInfoToRet = []

              results
                .forEach((result) => {
                  if(result.status == "fulfilled"){
                    chatInfoToRet.push({
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