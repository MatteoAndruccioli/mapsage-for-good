const Chat = require("../models/chatsModel")


//add new message with payload specified in messageBody in chat with id chat_id and sent by sented 
exports.addNewMsg = function(chat_id, sender, messageBody){

  Chat.findById(chat_id, function(err, chat) {
    if (err) {
      return { succeeded: false, error: err, description: "error in finding chat by id" }
    } else {
      if (chat == null) {
        return { succeeded: false, error: 'Chat does not exist'}
      } else {
        // la chat è presente

        //creo il nuovo messaggio con dati presenti in chat e dati inviati
        const newMessage = {
          //la posizione dovrà essere settata in base ai nuovi valori
          position: chat.nextMessagePosition,
          body: messageBody,
          sender: sender, //lo dovrai prendere dal JWT
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

        if (chat.user1 == sender) {
          //poichè sender è user1 => user1 ha visualizzato il messaggio
          new_visualized_by_user1 = true
        } else if (chat.user2 == sender){
          //poichè sender è user2 => user2 ha visualizzato il messaggio
          new_visualized_by_user2 = true
        } else {
          //questa eventualità non si dovrebbe mai verificare
          return { succeeded: false, error: "sender doesn't match with any of two users in chat"}
        }

        //aggiungo il nuovo messaggio all'oggetto chat, 
        //aggiorno valore di nextMessagePosition e visualized_by_user1 e visualized_by_user2
        
        Chat.findOneAndUpdate({_id: chat_id},
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
              return { succeeded: false,  error: "Something wrong when chat data!", description: updatedChat}
            } else {
              return { succeeded: true,  chat: updatedChat, description: "tutto ok chat aggiornata" }
            }
          })
          .catch(err => {
            return {  succeeded: false, error: err, description: "Mongoose error while updating chat data" }
          })
      }
    }
  })
}

